import ProductByOrders from "@/database/models/ProductByOrders";
import { DataProductsByOrdersType, ProductsByOrdersType } from "@/types/ProductsByOrdersType";
import { changeRangeDates } from "@/utils/formatDate";
import type { NextApiRequest, NextApiResponse } from "next";
import { Sequelize, Op } from 'sequelize';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductsByOrdersType | { error: string }>,
) {
  const { created_after, created_before } = req.body;

  if (!created_after || !created_before) {
    return res.status(400).json({ error: "Both created_after and created_before are required" });
  }

  try {
    const [startDate, endDate] = changeRangeDates(new Date(created_after), new Date(created_before));

    // 1. Obtener usuarios con al menos un orden en el rango
    const products_by_orders = await ProductByOrders.findAll({
      where: {
        [Op.and]: [
          Sequelize.literal(`exists (
            select 1 
            from json_array_elements(orders) as order_item
            where (order_item->>'updated_at')::timestamp between 
                  '${startDate.toISOString()}' and 
                  '${endDate.toISOString()}'
          )`)
        ]
      }
    });

    // 2. Convertir a objetos planos
    const _data = JSON.parse(JSON.stringify(products_by_orders)) as Array<DataProductsByOrdersType>;

    // 3. Filtrar órdenes dentro de cada usuario
    const data = _data.map(user => ({
      ...user,
      orders: user.orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= startDate && orderDate <= endDate;
      })
    }));

    // 4. Calcular estadísticas
    const product_numbers = data.length;
    const order_numbers = data.reduce((total, user) => total + user.orders.length, 0);

    res.status(200).json({
      data,
      product_numbers,
      order_numbers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}