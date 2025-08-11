// src/lib/db2.ts
import { Pool } from 'pg';

// Configuración de la segunda base de datos
const pool = new Pool({
    host: process.env.DB_HOST_VOYPATI,
    port: parseInt(process.env.DB_PORT_VOYPATI || '5432'),
    database: process.env.DB_NAME_VOYPATI,
    user: process.env.DB_USER_VOYPATI,
    password: process.env.DB_PASSWORD_VOYPATI,
    ssl: process.env.DB2_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 5, // Máximo de conexiones en el pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export const queryDb2 = async (sql: string, params?: any[]) => {
    const client = await pool.connect();
    try {
        const result = await client.query(sql, params);
        return result.rows;
    } catch (error) {
        console.error('Error en DB2 query:', error);
        throw error;
    } finally {
        client.release();
    }
};