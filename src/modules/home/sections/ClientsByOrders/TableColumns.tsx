import { BtnOption } from "@/components/MegaTable/components/BtnOption";
import { Flex, Text } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import flashy from "@pablotheblink/flashyjs";
import { OrderType } from "@/types/OrderType";
import { LuCopy } from "react-icons/lu";

export const columns = (): ColumnDef<any>[] => {

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log("Órdenes copiadas al portapapeles:", text);
                flashy.success("Órdenes copiadas al portapapeles", {
                    animation: 'bounce'
                });
            })
            .catch((error) => {
                console.error("Error al copiar el texto:", error);
                flashy.error("Error al copiar las órdenes", {
                    animation: 'bounce'
                });
            });
    };

    return (
        [
            {
                header: "Nombre Completo",
                accessorKey: "fullname",
            },
            {
                header: "Rango",
                accessorKey: "range_name",
            },
            {
                header: "Ordenes",
                accessorKey: "orders",
                cell: ({ getValue }) => {

                    return (
                        <Flex gap={2} alignItems={'center'}>
                            <Text>{getValue<string>().length}</Text>
                            <BtnOption
                                variant={'plain'}
                                size={'xs'}
                                label="More Filters"
                                icon={<LuCopy />}
                                borderRadius={'full'}
                                onClick={() => {
                                    const text = getValue<Array<OrderType>>().map((e: any) => e.order_number)
                                    copyToClipboard(text.join('\n'))
                                }}
                            />
                        </Flex>
                    )
                }
            }
        ]
    )
}