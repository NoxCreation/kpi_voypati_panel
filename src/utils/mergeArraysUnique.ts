/**
 * Fusiona dos arrays evitando elementos duplicados según una clave específica.
 * @param array1 Primer array a fusionar
 * @param array2 Segundo array a fusionar
 * @param uniqueKey Clave para identificar duplicados (por defecto 'order_id')
 * @returns Nuevo array fusionado sin duplicados
 */
export function mergeArraysUnique<T extends Record<string, any>>(
    array1: T[],
    array2: T[],
    uniqueKey: keyof T = 'order_id'
): T[] {
    // Crear un mapa para evitar duplicados
    const mergedMap = new Map<string | number, T>();

    // Agregar elementos del primer array
    array1.forEach(item => {
        const key = item[uniqueKey];
        if (key !== undefined) {
            mergedMap.set(key as string | number, item);
        }
    });

    // Agregar elementos del segundo array (sobrescriben si ya existen)
    array2.forEach(item => {
        const key = item[uniqueKey];
        if (key !== undefined) {
            mergedMap.set(key as string | number, item);
        }
    });

    // Convertir el mapa de vuelta a array
    return Array.from(mergedMap.values());
}