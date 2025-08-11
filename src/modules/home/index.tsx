import { Flex, Heading, Stack, Tabs } from "@chakra-ui/react";
import ClientsByOrders from "./sections/ClientsByOrders";
import { LuBox, LuUser } from "react-icons/lu";
import ProductsByOrders from "./sections/ProductByOrders";
import { ModalUpdate } from "./modal/ModalUpdate";

const HomeIndex = () => {

    return (
        <Stack gap={4}>
            <Tabs.Root defaultValue="client_orders" variant="plain">
                <Flex alignItems={'center'}>
                    <Tabs.List bg="bg.muted" rounded="l3" p="1" flex={1}>
                        <Tabs.Trigger value="client_orders">
                            <LuUser />
                            Clientes/Ordenes
                        </Tabs.Trigger>
                        <Tabs.Trigger value="products_orders">
                            <LuBox />
                            Productos/Ordenes
                        </Tabs.Trigger>
                        <Tabs.Indicator rounded="l2" />
                    </Tabs.List>
                    <Stack>
                        <ModalUpdate />
                    </Stack>
                </Flex>
                <Tabs.Content value="client_orders">

                    <Stack gap={4}>
                        <Heading flex={1}>Órdenes por Clientes</Heading>
                        <ClientsByOrders />
                    </Stack>

                </Tabs.Content>
                <Tabs.Content value="products_orders">

                    <Stack gap={4}>
                        <Heading flex={1}>Productos por Órdenes</Heading>
                        <ProductsByOrders />
                    </Stack>

                </Tabs.Content>
            </Tabs.Root>


        </Stack>
    )
}

export default HomeIndex