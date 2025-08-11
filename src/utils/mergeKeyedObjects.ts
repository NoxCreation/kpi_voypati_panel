/**
 * Fusiona dos objetos donde los valores son arrays, combinando los arrays cuando las claves coinciden
 * y evitando elementos duplicados según una clave de identificación.
 * 
 * @param obj1 Primer objeto a fusionar
 * @param obj2 Segundo objeto a fusionar
 * @param idKey Clave que identifica elementos únicos (por defecto 'id')
 * @returns Nuevo objeto fusionado
 */
export function mergeKeyedObjects<T extends Record<string, any[]>>(
    obj1: T,
    obj2: T,
    idKey: string = 'id'
): T {
    const result: any = { ...obj1 };

    for (const [key, items] of Object.entries(obj2)) {
        if (result[key]) {
            // Si la clave existe en ambos objetos, fusionamos los arrays evitando duplicados
            const existingIds = new Set(result[key].map((item: any) => item[idKey]));
            const newItems = items.filter((item: any) => !existingIds.has(item[idKey]));
            result[key] = [...result[key], ...newItems];
        } else {
            // Si es una clave nueva, la añadimos directamente
            result[key] = items;
        }
    }

    return result;
}