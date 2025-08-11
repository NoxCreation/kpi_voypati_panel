import Sync from "@/database/models/Sync";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
        // Obtener el registro directamente sin conversión JSON
        const syncRecord = await Sync.findOne();

        if (!syncRecord) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        // Calcular fecha de hace 2 días
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        // Actualizar el registro con la nueva fecha
        await Sync.update(
            { syncAt: twoDaysAgo },
            { where: { id: syncRecord.id } }
        );

        res.status(200).json({});
    } catch (error) {
        console.error("Error en /api/sync:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}