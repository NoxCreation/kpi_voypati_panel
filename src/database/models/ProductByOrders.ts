import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

interface ProductByOrdersAttributes {
    id?: string;
    variant_id: string;
    product_id: string;
    variant_name: string;
    orders: any;
}

class ProductByOrders extends Model<ProductByOrdersAttributes> implements ProductByOrdersAttributes {
    public id!: string;
    public variant_id!: string;
    public product_id!: string;
    public variant_name!: string;
    public orders!: any;
}

ProductByOrders.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        variant_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        variant_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orders: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: '[]'
        },
    },
    {
        sequelize,
        modelName: 'ProductByOrders',
        tableName: 'product_by_orders',
        timestamps: true,
    }
);

export default ProductByOrders;