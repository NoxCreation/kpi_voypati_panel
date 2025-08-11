export type OrderType = {
    id: string,
    number: string,
    status: {
        id: string,
        name: string,
        event: string
    },
    client?: {
        client_id: string
        user_id: string
        first_name: string
        last_name: string
        image: string
    },
    items: Array<{
        id: string,
        product_id: string,
        name: string
        sku: string,
        price: number,
        cost: number,
        quantity: number,
        discount: number
    }>
    created_at: string
    updated_at: string
}