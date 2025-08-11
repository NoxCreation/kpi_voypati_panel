import dotenv from "dotenv";
dotenv.config();

interface DbConfig {
    [env: string]: {
        username: string;
        password: string;
        database: string;
        host: string;
        port: number;
        dialect: 'postgres';
    };
}

const config: DbConfig = {
    development: {
        username: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT!),
        dialect: 'postgres',
    },
    production: {
        username: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT!),
        dialect: 'postgres',
    },
};

export default config;