import { initializeModels } from "@/database/models";
import sequelize from "@/database/sequelize";

// Opciones de sincronización (elige solo UNA)
const SYNC_OPTIONS = {
    // OPCIÓN 1: Sincronización segura (solo agrega lo nuevo)
    safe: {
        alter: false,    // No modifica columnas existentes
        force: false,    // No borra tablas existentes
    },

    // OPCIÓN 2: Modo alter (agrega nuevo y modifica existente)
    alter: {
        alter: true,     // Modifica columnas existentes
        force: false,
    },

    // OPCIÓN 3: Modo desarrollo (reseteo completo - ¡CUIDADO!)
    dev: {
        force: true,     // Borra todo y recrea
        alter: false,
    }
};

export const syncDatabase = async () => {
    // Importaciones dinámicas solo para servidor
    try {
        initializeModels();
        await sequelize.authenticate();
        console.log('✅ Conexión a DB establecida');

        // Elige la opción deseada:
        await sequelize.sync(SYNC_OPTIONS.alter); // Cambia a safe/alter/dev según necesites

        console.log('✅ Modelos sincronizados con la base de datos');
    } catch (error) {
        console.error('❌ Error de sincronización:', error);
        process.exit(1);
    }
};