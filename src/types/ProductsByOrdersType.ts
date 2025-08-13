
export type OrderProductsByOrdersType = {
    order_id: string
    order_number: string
    created_at: string
    updated_at: string
}

export type DataProductsByOrdersType = {
    id: string
    product_id: string
    variant_id: string
    variant_name: string
    orders: Array<OrderProductsByOrdersType>
    createdAt: string
    updatedAt: string
}

export type ProductsByOrdersType = {
    data: Array<DataProductsByOrdersType>
    product_numbers: number
    order_numbers: number
}