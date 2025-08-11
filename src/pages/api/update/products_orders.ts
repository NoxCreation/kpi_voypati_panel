import ProductByOrders from "@/database/models/ProductByOrders";
import Sync from "@/database/models/Sync";
import { StatusEvent } from "@/lib/const";
import { OrderType } from "@/types/OrderType";
import { getOrdersPaginate } from "@/utils/API/getOrders";
import { changeRangeDates } from "@/utils/formatDate";
import { mapProductByOrders } from "@/utils/maps/mapProductByOrders";
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
  } = req.query

  // Solo parsear si existen
  const pageNumber = parseInt(page as string) || 1;
  const pageSizeNumber = parseInt(pageSize as string) || 10;

  const [startDate, endDate] = changeRangeDates(
    new Date(syncAt),
    new Date()
  );

  // Obtener órdenes paginadas
  const { count, orders } = await getOrdersPaginate(
    StatusEvent.completed,
    pageNumber,
    pageSizeNumber,
    { startDate, endDate }
  );

  await saveProductByOrders(orders);

  res.status(200).json({
    count,
    orders
  });
}

// Guarda la relación de ordenes por clientes
const saveProductByOrders = async (orders: Array<OrderType>) => {
  const product_by_orders = mapProductByOrders(orders)

  const keys = Object.keys(product_by_orders)
  for (const index in keys) {
    const variant_name = keys[index]
    const data = product_by_orders[variant_name] as Array<any>
    const variant_id = data.length > 0 ? data[0].variant_id : ''
    const product_id = data.length > 0 ? data[0].product_id : ''

    const last = await ProductByOrders.findOne({
      where: {
        variant_id
      }
    })

    // Si no hay este usuario registrado, es porque es nuevo
    if (last == undefined) {
      const news_orders = data.map(e => ({
        order_number: e.order_number,
        order_id: e.order_id,
        quantity: e.quantity,
        created_at: e.created_at,
        updated_at: e.updated_at
      }))
      ProductByOrders.create({
        variant_id,
        product_id,
        variant_name,
        orders: news_orders
      })
      //console.log(`Agregado: ${variant_name}`)
    }
    // Si esta registrado, lo que hacemos es que cogemos su anterior registro de orders y lo actualizamos
    else {
      const old_orders = last.orders
      const news_orders = data.map(e => ({
        order_number: e.order_number,
        order_id: e.order_id,
        quantity: e.quantity,
        created_at: e.created_at,
        updated_at: e.updated_at
      }))
      const final_orders = mergeArraysUnique(old_orders, news_orders, "order_id")
      ProductByOrders.update({
        variant_id,
        product_id,
        variant_name,
        orders: final_orders
      }, {
        where: {
          id: last.id
        }
      })
      //console.log(`Actualizado: ${variant_name}`)
    }
  }
}
