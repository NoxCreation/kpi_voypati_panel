import { OrderType } from "@/types/OrderType";
import { queryDb2 } from "../queryDb2";
import { getEvents } from "./getEvents";
import { StatusEvent } from "@/lib/const";
import { getEventId } from "../getEventId";
import { mapOrders } from "../maps/mapOrders";

export const getOrdersPaginate = async (
    status: StatusEvent,
    page: number,
    pageSize: number,
    dateRange?: {
        startDate?: string | Date;
        endDate?: string | Date;
    }
): Promise<{
    count: number
    orders: Array<OrderType>
}> => {
    const events = await getEvents();
    const statusid = await getEventId(events, status);

    // Construcción de la consulta SQL con parámetros
    let query = `
        SELECT 
            orders.*, 
            row_to_json(status.*) AS status,
            json_build_object(
                'client_data', client.*,
                'user_data', (
                    SELECT row_to_json(users.*)
                    FROM public.users_user AS users
                    WHERE users.id = client.user_id
                )
            ) AS client,
            (
                SELECT json_agg(
                    json_build_object(
                        'variant', row_to_json(v.*),
                        'data', row_to_json(oi.*)
                    )
                )
                FROM public.orders_orderitem AS oi
                JOIN public.warehouses_variant AS v ON oi.variant_id = v.id
                WHERE oi.order_id = orders.id
            ) AS items
        FROM 
            public.orders_order as orders 
        JOIN 
            public.orders_orderstatus AS status 
            ON orders.status_id = status.id
        LEFT JOIN
            public.users_client AS client 
            ON orders.client_id = client.id
        WHERE 
            orders.is_paid = true AND
            orders.status_id = $1
    `;

    let query_count = `
        SELECT COUNT(orders.id)
        FROM public.orders_order as orders
        JOIN public.orders_orderstatus AS status ON orders.status_id = status.id
        JOIN public.users_client AS client ON orders.client_id = client.id
        WHERE orders.is_paid = true AND orders.status_id = $1
    `

    const params: any[] = [statusid, pageSize, (page - 1) * pageSize];
    const params_count: any[] = [statusid];

    // Agregar condiciones de fecha si existen
    if (dateRange?.startDate) {
        query += ` AND orders.created_at >= $${params.length + 1}`;
        query_count += ` AND orders.created_at >= $${params_count.length + 1}`;
        params.push(new Date(dateRange.startDate).toISOString());
        params_count.push(new Date(dateRange.startDate).toISOString());
    }

    if (dateRange?.endDate) {
        query += ` AND orders.created_at <= $${params.length + 1}`;
        query_count += ` AND orders.created_at <= $${params_count.length + 1}`;
        params.push(new Date(dateRange.endDate).toISOString());
        params_count.push(new Date(dateRange.endDate).toISOString());
    }

    query += ` 
        ORDER BY orders.created_at ASC
        LIMIT $2
        OFFSET $3;
    `;

    // Ejecutar consulta con parámetros (evita SQL injection)
    const data = (await queryDb2(query, params)) as Array<OrderType>;
    const count = (await queryDb2(query_count, params_count)) as [{ count: string }];

    // agregando el event a los datos
    data.forEach((e) => {
        const status_id = e.status.id;
        const index = Object.values(events).findIndex((e) => e == status_id);
        e.status.event = Object.keys(events)[index];
    });

    //console.log("Ordenes en cero", data.filter(e => e.items == undefined))

    return {
        count: parseInt(count[0].count),
        orders: data.map(e => mapOrders(e))
    };
};
