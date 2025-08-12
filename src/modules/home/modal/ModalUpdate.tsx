import { Alert, Button, CloseButton, DataList, Dialog, HStack, IconButton, Portal, Progress, Stack } from "@chakra-ui/react"
import { useState } from "react"
import { FiRefreshCcw } from "react-icons/fi"

const pageSize = 200
export const ModalUpdate = () => {

    const [loading, setLoading] = useState(false)
    const [percent1, setPercent1] = useState(0)
    const [error1, setError1] = useState(undefined as undefined | string)
    const [percent2, setPercent2] = useState(0)
    const [error2, setError2] = useState(undefined as undefined | string)

    const handleUpdateClientOrder = async () => {
        setError1("")
        setError2("")

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        } as any

        let index = 1
        while (true) {
            try {
                const response = await fetch(`/api/update/client_orders?page=${index}&pageSize=${pageSize}$revalidate=${index == 1}`, requestOptions)
                const {
                    count,
                } = await response.json()
                console.log(index * pageSize, "/", count)
                const part = index * pageSize
                const all = count
                const percent = part / all * 100
                setPercent1(percent)
                if (percent > 100) {
                    setPercent1(0)
                    break
                }
                index++
            }
            catch {
                setError1("Ha ocurrido un error actualizando Clientes/Ordenes.")
                break
            }
        }
        console.log("final")
    }

    const handleUpdateProductsOrder = async () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        } as any

        let index = 1
        while (true) {
            try {
                const response = await fetch(`/api/update/products_orders?page=${index}&pageSize=${pageSize}$revalidate=${index == 1}`, requestOptions)
                const {
                    count,
                } = await response.json()
                console.log(index * pageSize, "/", count)
                const part = index * pageSize
                const all = count
                const percent = part / all * 100
                setPercent2(percent)
                if (percent > 100) {
                    setPercent2(0)
                    break
                }
                index++
            }
            catch {
                setError2("Ha ocurrido un error actualizando Productos/Ordenes.")
                break
            }
        }
        console.log("final")
    }

    const handleUpdateSync = async () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        } as any

        await fetch(`/api/update/sync`, requestOptions)
    }

    const handleUpdate = async () => {
        setLoading(true)

        await Promise.all([
            handleUpdateClientOrder(),
            handleUpdateProductsOrder()
        ])

        await handleUpdateSync()

        setLoading(false)
    }

    return (
        <Dialog.Root size={'md'}>
            <Dialog.Trigger asChild>
                <IconButton aria-label="Call support" rounded="full" size={'sm'}>
                    <FiRefreshCcw />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Actualizar</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Stack gap="4">

                                <DataList.Root size="sm">
                                    <DataList.Item>
                                        <DataList.ItemLabel>Clientes/Ordenes</DataList.ItemLabel>
                                        <DataList.ItemValue>

                                            <Progress.Root value={percent1} maxW="md" w={'100%'}>
                                                <HStack gap="5">
                                                    <Progress.Label>Porciento</Progress.Label>
                                                    <Progress.Track flex="1">
                                                        <Progress.Range />
                                                    </Progress.Track>
                                                    <Progress.ValueText>{percent1.toFixed(0)}%</Progress.ValueText>
                                                </HStack>
                                            </Progress.Root>
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                </DataList.Root>
                                {error1 && <Alert.Root status="error">
                                    <Alert.Indicator />
                                    <Alert.Content>
                                        <Alert.Description>
                                            {error1}
                                        </Alert.Description>
                                    </Alert.Content>
                                </Alert.Root>}

                                <DataList.Root size="sm">
                                    <DataList.Item>
                                        <DataList.ItemLabel>Productos/Ordenes</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            <Progress.Root value={percent2} maxW="md" w={'100%'}>
                                                <HStack gap="5">
                                                    <Progress.Label>Porciento</Progress.Label>
                                                    <Progress.Track flex="1">
                                                        <Progress.Range />
                                                    </Progress.Track>
                                                    <Progress.ValueText>{percent2.toFixed(0)}%</Progress.ValueText>
                                                </HStack>
                                            </Progress.Root>
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                </DataList.Root>
                                {error2 && <Alert.Root status="error">
                                    <Alert.Indicator />
                                    <Alert.Content>
                                        <Alert.Description>
                                            {error2}
                                        </Alert.Description>
                                    </Alert.Content>
                                </Alert.Root>}

                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" disabled={loading}>Cancelar</Button>
                            </Dialog.ActionTrigger>
                            <Button onClick={handleUpdate} disabled={loading}>Actualizar</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" disabled={loading} />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}