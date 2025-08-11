import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

interface OrderByUsersAttributes {
    id?: string;
    client_id: string;
    range_name: string;
    fullname: string;
    orders: any;
}

class OrderByUsers extends Model<OrderByUsersAttributes> implements OrderByUsersAttributes {
    public id!: string;
    public client_id!: string;
    public range_name!: string;
    public fullname!: string;
    public orders!: any;
}

OrderByUsers.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        client_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        range_name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        fullname: {
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
        modelName: 'OrderByUsers',
        tableName: 'order_by_users',
        timestamps: true,
    }
);

export default OrderByUsers;