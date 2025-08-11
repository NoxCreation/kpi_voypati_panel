import { ClientType } from "@/types/ClientType";
import { OrderType } from "@/types/OrderType";

export interface OrderClient {
    client_id?: string;
    range_name: string
    order_number: string;
    order_id: string;
    created_at: string;
    updated_at: string;
}

interface ClientOrders {
    [clientName: string]: OrderClient[];
}

export const mapOrdersByClient = (
    orders: Array<OrderType>,
    clients: Array<ClientType>
) => {
    // Primero creamos un mapa de clientes para acceso O(1)
    const clientsMap = clients.reduce<Record<string, { fullname: string, range_name: string }>>((acc, client) => {
        acc[client.id] = {
            fullname: `${client.first_name} ${client.last_name}`,
            range_name: client.range_name
        };
        return acc;
    }, {});
    clientsMap['undefined'] = {
        fullname: "Sin CLiente",
        range_name: ""
    }

    // Procesamos las órdenes en un solo paso
    return orders.reduce<ClientOrders>((acc, order) => {
        const clientId = order.client != undefined ? order.client.client_id : 'undefined';
        if(clientId == 'undefined')
            console.log("UN UNDEFINED")
        if (clientsMap[clientId] != undefined) {
            const clientName = clientsMap[clientId].fullname;
            const clientRange = clientsMap[clientId].range_name;

            if (!clientName) return acc; // Omitir clientes no encontrados

            if (!acc[clientName]) {
                acc[clientName] = [];
            }

            acc[clientName].push({
                client_id: order.client ? order.client.client_id : undefined,
                range_name: clientRange,
                order_number: order.number,
                order_id: order.id,
                created_at: order.created_at,
                updated_at: order.updated_at,
            });
        }

        return acc;
    }, {});
};