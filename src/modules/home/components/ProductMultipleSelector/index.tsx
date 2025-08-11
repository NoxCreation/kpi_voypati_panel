import { SelectField } from "@/components/SelectField"
import { DataProductsByOrdersType } from "@/types/ProductsByOrdersType"
import { Flex } from "@chakra-ui/react"
import { useEffect, useState } from "react"

export const ProductMultipleSelector = ({
    data,
    onChange
}: {
    data: Array<DataProductsByOrdersType>
    onChange: (data: {
        month: string;
    }[]) => void
}) => {
    const [fullname1, setFullname1] = useState("")
    const [fullname2, setFullname2] = useState("")

    const handleTest = (fullname1: string, fullname2: string) => {
        const targets = data.filter(e => e.variant_name === fullname1 || e.variant_name === fullname2);

        // Obtener todos los nombres de usuarios únicos
        const allUserNames = Array.from(new Set(targets.map(user => user.variant_name)));

        // Paso 1: Crear un mapa para almacenar los datos diarios
        const dailyMap: Record<string, Record<string, number>> = {};
        const allDates = new Set<string>();

        // Primero: Inicializar todos los días con 0 para todos los usuarios
        targets.forEach(user => {
            user.orders.forEach(order => {
                const orderDate = new Date(order.created_at);
                const dateKey = orderDate.toISOString().split('T')[0];
                allDates.add(dateKey);

                // Solo inicializar si no existe
                if (!dailyMap[dateKey]) {
                    dailyMap[dateKey] = {};
                    allUserNames.forEach(name => {
                        dailyMap[dateKey][name] = 0;
                    });
                }
            });
        });

        // Segundo: Contar las órdenes (sin reinicializar)
        targets.forEach(user => {
            user.orders.forEach(order => {
                const orderDate = new Date(order.created_at);
                const dateKey = orderDate.toISOString().split('T')[0];

                if (dailyMap[dateKey] && dailyMap[dateKey][user.variant_name] !== undefined) {
                    dailyMap[dateKey][user.variant_name]++;
                }
            });
        });

        // Paso 2: Convertir el mapa en un arreglo de objetos
        const result = Array.from(allDates).map(dateKey => {
            return {
                ...dailyMap[dateKey],
                month: dateKey
            };
        });

        // Paso 3: Ordenar los resultados por fecha
        const sortedResult = result.sort((a, b) =>
            new Date(a.month).getTime() - new Date(b.month).getTime()
        );

        onChange(sortedResult);
    }

    useEffect(() => {
        handleTest(fullname1, fullname2)
    }, [fullname1, fullname2])

    return (
        <Flex gap={4}>
            <SelectField
                defaultValue={fullname1}
                options={
                    data.map((e) => ({
                        label: e.variant_name,
                        description: `${e.orders.length} ordenes`,
                        value: e.variant_name
                    }))
                }
                placeholder={fullname1 != '' ? fullname1 : "Elija un producto"}
                onChange={(e) => {
                    setFullname1(e.target.value)
                }}
            />
            <SelectField
                defaultValue={fullname2}
                options={
                    data.map((e) => ({
                        label: e.variant_name,
                        description: `${e.orders.length} ordenes`,
                        value: e.variant_name
                    }))
                }
                placeholder={fullname2 != '' ? fullname2 : "Elija un producto"}
                onChange={(e) => {
                    setFullname2(e.target.value)
                }}
            />
        </Flex>
    )
}