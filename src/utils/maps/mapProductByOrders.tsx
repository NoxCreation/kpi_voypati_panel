import { OrderType } from "@/types/OrderType";

interface ProductOrders {
    [productName: string]: Array<{
        variant_id: string;
        product_id: string;
        order_number: string;
        order_id: string;
        quantity: number;
        price: number;
        cost: number;
        created_at: string;
        updated_at: string;
    }>;
}

export function mapProductByOrders(orders: OrderType[]): ProductOrders {
    const result: ProductOrders = {};

    orders.forEach(order => {
        order.items.forEach(item => {
            if (!result[item.name]) {
                result[item.name] = [];
            }

            result[item.name].push({
                variant_id: item.id,
                product_id: item.product_id,
                order_number: order.number,
                order_id: order.id,
                quantity: item.quantity,
                price: item.price,
                cost: item.cost,
                created_at: order.created_at,
                updated_at: order.updated_at,
            });
        });
    });

    return result;
}