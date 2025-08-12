export const mapOrders = (order: any) => ({
    id: order.id,
    number: order.number,
    status: {
        id: order.status.id,
        name: order.status.name,
        event: order.status.event
    },
    client: order.client.client_data != undefined ? {
        client_id: order.client.client_data.id,
        user_id: order.client.user_data.id,
        first_name: order.client.user_data.first_name,
        last_name: order.client.user_data.last_name,
        image: order.client.user_data.image,
    } : undefined,
    items: order.items ? order.items.map((e: any) => ({
        id: e.variant.id,
        product_id: e.variant.product_id,
        name: e.variant.name,
        sku: e.variant.sku,
        price: e.data.price,
        cost: e.data.cost,
        quantity: e.data.quantity,
        discount: e.data.discount
    })) : [],
    created_at: order.created_at,
    updated_at: order.updated_at,
})