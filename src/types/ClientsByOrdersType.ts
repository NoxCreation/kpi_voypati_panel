
export type OrderClientsByOrdersType = {
    order_id: string
    order_number: string
    created_at: string
    updated_at: string
}

export type DataClientsByOrdersType = {
    id: string
    client_id: string
    range_name: string
    fullname: string
    orders: Array<OrderClientsByOrdersType>
    createdAt: string
    updatedAt: string
}

export type ClientsByOrdersType = {
    data: Array<DataClientsByOrdersType>
    client_numbers: number
    order_numbers: number
}