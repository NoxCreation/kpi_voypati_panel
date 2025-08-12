import OrderByUsers from "@/database/models/OrderByUsers";
import Sync from "@/database/models/Sync";
import { StatusEvent } from "@/lib/const";
import { ClientType } from "@/types/ClientType";
import { OrderType } from "@/types/OrderType";
import { getClients } from "@/utils/API/getClients";
import { getOrdersPaginate } from "@/utils/API/getOrders";
import { changeRangeDates } from "@/utils/formatDate";
import { mapOrdersByClient, OrderClient } from "@/utils/maps/mapOrdersByClient";
import { mergeArraysUnique } from "@/utils/mergeArraysUnique";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    if (req.method != 'GET')
        return res.status(200).json({ error: "Metodo no permitido" });

    const sync = await Sync.findOne()
    if (sync == undefined)
        return res.status(200).json({ error: "Arrancar primero" });
    const syncAt = JSON.parse(JSON.stringify(sync)).syncAt.split("T")[0]

    const {
        page,
        pageSize,
        revalidate
    } = req.query

    // Solo parsear si existen
    const pageNumber = parseInt(page as string) || 1;
    const pageSizeNumber = parseInt(pageSize as string) || 10;
    const shouldRevalidate = revalidate === 'true';  // Verificar flag

    const [startDate, endDate] = changeRangeDates(
        new Date(syncAt),
        new Date()
    );

    // Obtener órdenes paginadas
    try {
        const { count, orders } = await getOrdersPaginate(
            StatusEvent.completed,
            pageNumber,
            pageSizeNumber,
            { startDate, endDate }
        );

        const clients = await getClients(shouldRevalidate);
        await saveOrdersByClients(orders, clients);

        res.status(200).json({
            count,
            orders
        });
    }
    catch (error) {
        console.log('err', error)
    }
    res.status(400).json({});
}

// Guarda la relación de ordenes por clientes
const saveOrdersByClients = async (orders: Array<OrderType>, clients: Array<ClientType>) => {
    const orders_by_clients = mapOrdersByClient(orders, clients)

    const keys = Object.keys(orders_by_clients)
    for (const index in keys) {
        const fullname = keys[index]
        const data = orders_by_clients[fullname] as Array<OrderClient>
        const client_id = data.length > 0 ? (data[0].client_id ? data[0].client_id : 'undefined') : ''
        const range_name = data[0].range_name

        const last = await OrderByUsers.findOne({
            where: {
                client_id
            }
        })

        // Si no hay este usuario registrado, es porque es nuevo
        if (last == undefined) {
            const news_orders = data.map(e => ({
                order_number: e.order_number,
                order_id: e.order_id,
                created_at: e.created_at,
                updated_at: e.updated_at
            }))
            OrderByUsers.create({
                client_id,
                range_name,
                fullname,
                orders: news_orders
            })
            //console.log(`Agregado: ${fullname}`)
        }
        // Si esta registrado, lo que hacemos es que cogemos su anterior registro de orders y lo actualizamos
        else {
            const old_orders = last.orders
            const news_orders = data.map(e => ({
                order_number: e.order_number,
                order_id: e.order_id,
                created_at: e.created_at,
                updated_at: e.updated_at,
            }))
            const final_orders = JSON.parse(JSON.stringify(mergeArraysUnique(old_orders, news_orders, "order_id")))
            OrderByUsers.update({
                client_id,
                fullname,
                orders: final_orders
            }, {
                where: {
                    id: last.id
                }
            })
            //console.log(`Actualizado: ${fullname}`)
        }

    }
}
