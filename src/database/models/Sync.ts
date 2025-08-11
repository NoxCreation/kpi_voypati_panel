import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

interface SyncAttributes {
    id?: string;
    syncAt: Date
}

class Sync extends Model<SyncAttributes> implements SyncAttributes {
    public id!: string;
    public syncAt!: Date;
}

Sync.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        syncAt: {
            type: DataTypes.DATE,
            defaultValue: new Date()
        }
    },
    {
        sequelize,
        modelName: 'Sync',
        tableName: 'sync',
        timestamps: true,
    }
);

export default Sync;