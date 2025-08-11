// utils/API/getClients.ts
import { queryDb2 } from "../queryDb2";
import { mapClients } from "../maps/mapClients";
import { ClientType } from "@/types/ClientType";
import NodeCache from "node-cache";

// Crear caché con TTL de 5 mint (300 segundos -> 1mint = 60seg = 5 * 60 = 300)
const clientCache = new NodeCache({ stdTTL: 300 });
const CACHE_KEY = "clients";

export const getClients = async (shouldRevalidate: boolean = false): Promise<Array<ClientType>> => {
    if (shouldRevalidate)
        clientCache.del(CACHE_KEY) // si borra la cache antes del tiempo
    // Paso 2: Verificar si existe en caché
    const cachedClients = clientCache.get(CACHE_KEY);
    if (cachedClients) {
        console.log("clientes de cache")
        return cachedClients as ClientType[];
    }

    // Consulta SQL (sin cambios)
    const query = `
        SELECT 
            client.*,
            row_to_json(users.*) AS user,
            row_to_json(range.*) AS range
        FROM 
            public.users_client as client
        JOIN 
            public.users_user AS users ON client.user_id = users.id
        JOIN 
            public.users_range AS range ON client.range_id = range.id
        WHERE
            client.verified = true
        ORDER BY client.created_at ASC
    `;

    const data = await queryDb2(query);
    const mappedClients = data.map(e => mapClients(e));

    // Paso 3: Guardar en caché
    console.log("clientes de bd")
    clientCache.set(CACHE_KEY, mappedClients);

    return mappedClients;
};