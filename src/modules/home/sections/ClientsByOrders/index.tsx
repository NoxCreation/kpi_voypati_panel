import { MegaTable, MegaTableHandle } from "@/components/MegaTable";
import { PaginationType } from "@/components/MegaTable/components/Types/PaginationType";
import StatsCards from "@/components/StatsCards"
import { Box, Card, Flex, Progress, Stack, Text } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import { FiActivity, FiUser } from "react-icons/fi";
import { BtnOption } from "@/components/MegaTable/components/BtnOption";
import { LiaFileExcel } from "react-icons/lia";
import ExcelJS from 'exceljs';
import DateRangeSelector from "@/components/DateRangeSelector";
import { changeRangeInitMonth, getFormatDate } from "@/utils/formatDate";
import { columns } from "./TableColumns";
import { CardLineChartOrderClient } from "../../components/CardLineChartOrderClient";
import { ClientMultipleSelector } from "../../components/ClientMultipleSelector";
import { ClientsByOrdersType, DataClientsByOrdersType } from "@/types/ClientsByOrdersType";
import { CardPieChartOrderClient } from "../../components/CardPieChartOrderClient";
import { LuPawPrint } from "react-icons/lu";

const ClientsByOrders = () => {
    const [loading, setLoading] = useState(false)
    const [data_by_ranges, set_data_by_ranges] = useState([] as Array<{ name: string, value: number, color: string }>)
    const [client_more, set_client_more] = useState({
        fullname: "",
        number: 0
    })
    const [client_less, set_client_less] = useState({
        fullname: "",
        number: 0
    })
    const [client_numbers, set_client_numbers] = useState(0)
    const [order_numbers, set_order_numbers] = useState(0)
    const [data, setData] = useState([] as Array<DataClientsByOrdersType>)

    const [rangeDate, setRangeDate] = useState([changeRangeInitMonth()[0], changeRangeInitMonth()[1]] as [Date, Date])
    const tableRef = useRef<MegaTableHandle>(null);

    const onGetExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Clientes y ordenes';
        workbook.created = new Date();

        const summarySheet = workbook.addWorksheet("Resumen");
        /* const headerStyle = {
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'E2E8F0' }
            },
            font: {
                color: { argb: '2D3748' },
                bold: true
            },
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            },
            alignment: { wrapText: true }
        };
 */
        const cellStyle = {
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            },
            alignment: { wrapText: true }
        };

        summarySheet.getColumn(1).width = 25;
        summarySheet.getColumn(2).width = 30;

        const summaryRows = [
            ["Nombre Completo", "Cantidad de ordenes"],
        ];

        summaryRows.forEach((row, index) => {
            const sheetRow = summarySheet.addRow(row) as any;
            if (index === 5) {
                sheetRow.getCell(1).style = {
                    font: { bold: true },
                    ...cellStyle
                };
                summarySheet.mergeCells(`A${sheetRow.number}:B${sheetRow.number}`);
            } else if (row.length > 0) {
                sheetRow.eachCell((cell: any) => {
                    cell.style = cellStyle;
                });
            }
        });

        data.map(e => {
            const row = summarySheet.addRow([
                e.fullname,
                e.orders.length
            ]);

            row.eachCell((cell: any) => {
                cell.style = cellStyle;
                if (cell.col === 4 && typeof cell.value === 'number') {
                    cell.style.fill = {
                        type: 'pattern',
                        pattern: 'none',
                        fgColor: { argb: 'F7FAFC' }
                    };
                }
            });
        })

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `file.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const onLoad = async () => {
        setLoading(true)
        const [created_after, created_before] = getFormatDate(rangeDate[0], rangeDate[1])

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
            created_after,
            created_before
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        } as any

        const response = await fetch("/api/loadClientByOrders", requestOptions)
        const {
            data,
            client_numbers,
            order_numbers
        } = await response.json() as ClientsByOrdersType

        setData(data)
        set_client_numbers(client_numbers)
        set_order_numbers(order_numbers)

        const more = {
            fullname: "",
            number: 0
        }
        const less = {
            fullname: "",
            number: 1000
        }
        data.forEach(a => {
            if (a.orders.length > more.number) {
                more.fullname = a.fullname
                more.number = a.orders.length
            }

            if (a.orders.length < less.number) {
                less.fullname = a.fullname
                less.number = a.orders.length
            }
        })
        set_client_more(more)
        set_client_less(less)

        if (tableRef.current)
            tableRef.current.forceUpdateData(data.slice(0, 10), {
                ...tableRef.current.pagination,
                count: data.length,
                page: 0,
                pageSize: 10
            })

        // extrayendo ventas por rangos
        let data_by_ranges = data.reduce((p, c) => {
            if (p[c.range_name] == undefined) {
                p[c.range_name] = 1
            }
            else {
                p[c.range_name] += 1
            }
            return p
        }, {} as { [range: string]: number }) as any
        data_by_ranges = Object.keys(data_by_ranges).map(key => ({
            name: key,
            value: data_by_ranges[key],
            color: 'red'
        }))
        set_data_by_ranges(data_by_ranges)

        setDataLineCartOrderClient([])
        setDataLineCartOrders(getOrderByDates(data) as any)
        console.log(getOrderByDates(data))

        setLoading(false)
    }

    const [dataLineCartOrderClient, setDataLineCartOrderClient] = useState([])
    const [dataLineCartOrders, setDataLineCartOrders] = useState([])

    const getOrderByDates = (data: Array<DataClientsByOrdersType>) => {
        const targets = data.map(e => e.orders).reduce((p, c) => [...p, ...c], []);

        const result = {} as { [date: string]: number };

        targets.forEach(order => {
            // 1. Crear fecha en zona horaria local
            const orderDate = new Date(order.updated_at);

            // 2. Obtener componentes de fecha local
            const year = orderDate.getFullYear();
            const month = String(orderDate.getMonth() + 1).padStart(2, '0');
            const day = String(orderDate.getDate()).padStart(2, '0');

            // 3. Crear clave en formato YYYY-MM-DD (local)
            const dateKey = `${year}-${month}-${day}`;

            result[dateKey] = (result[dateKey] || 0) + 1;
        });

        // Convertir a array y ordenar cronológicamente
        return Object.keys(result)
            .map(key => ({
                orders: result[key],
                month: key
            }))
            .sort((a, b) => a.month.localeCompare(b.month));
    };

    useEffect(() => {
        onLoad()
    }, [rangeDate])

    return (
        <Stack gap={4}>
            {loading && <Flex gap={2}>
                <Stack flex={5} textAlign={'end'}>
                    <Text color={'gray.500'} fontSize={'12px'}>Cargando</Text>
                </Stack>
                <Stack flex={1} maxW="240px" justifyContent={'center'}>
                    <Progress.Root w={'100%'} value={null}>
                        <Progress.Track>
                            <Progress.Range />
                        </Progress.Track>
                    </Progress.Root>
                </Stack>
            </Flex>}

            {/* Filtro de fecha */}
            <Stack>
                <Card.Root>
                    <Card.Body>
                        <Stack>
                            <Text color={'gray.400'} fontSize={'12px'}>Filtrar por fecha</Text>
                            <DateRangeSelector value={rangeDate} onChange={(startDate: Date, endDate: Date) => {
                                setRangeDate([startDate, endDate])
                            }} />
                        </Stack>
                    </Card.Body>
                </Card.Root>
            </Stack>

            {/* Card de clientes activos y ordenes completadas */}
            <Flex gap={4}>
                <StatsCards label={"Clientes Activos"}
                    description={"Cantidad de clientes aplicación con órdenes"}
                    value={client_numbers}
                    element={(
                        <Box
                            bg={'pink.500'}
                            p={"12px"}
                            borderRadius={'full'}
                            color={'white'}
                            w={'40px'}
                            h={'40px'}
                        >
                            <FiActivity />
                        </Box>
                    )}
                />

                <StatsCards label={"Órdenes Completadas"}
                    description={"Cantidad de órdenes completadas realizadas"}
                    value={order_numbers}
                    element={(
                        <Box
                            bg={'pink.500'}
                            p={"12px"}
                            borderRadius={'full'}
                            color={'white'}
                            w={'40px'}
                            h={'40px'}
                        >
                            <FiActivity />
                        </Box>
                    )}
                />
            </Flex>

            {/* Card de clientes mas con mas o menos ordens */}
            <Flex gap={4}>
                <StatsCards label={"Cliente con mayor cantidad de órdenes"}
                    description={`${client_more.number} orden/es`}
                    value={client_more.fullname}
                    element={(
                        <Box
                            bg={'purple.500'}
                            p={"12px"}
                            borderRadius={'full'}
                            color={'white'}
                            w={'40px'}
                            h={'40px'}
                        >
                            <FiUser />
                        </Box>
                    )}
                />

                <StatsCards label={"Cliente con menor cantidad de órdenes"}
                    description={`${client_less.number} orden/es`}
                    value={client_less.fullname}
                    element={(
                        <Box
                            bg={'purple.500'}
                            p={"12px"}
                            borderRadius={'full'}
                            color={'white'}
                            w={'40px'}
                            h={'40px'}
                        >
                            <FiUser />
                        </Box>
                    )}
                />
            </Flex>

            {/* Tabla de clientes contra ordenes */}
            <Stack>
                <Card.Root>
                    <Card.Header>
                        <Flex>
                            <Stack flex={1}>
                                <Card.Title>Clientes por Ordenes</Card.Title>
                                <Card.Description>
                                    Listado de clientes y las órdenes generadas
                                </Card.Description>
                            </Stack>
                            <BtnOption
                                size={'xs'}
                                label="Exportar a Excel"
                                icon={<LiaFileExcel />}
                                color={'white'}
                                colorScheme="gray.50"
                                w={'fit-content'}
                                borderRadius={'full'}
                                onClick={onGetExcel}
                            />
                        </Flex>
                    </Card.Header>
                    <Card.Body gap="2">
                        <MegaTable
                            ref={tableRef}
                            initialice={{
                                data: data,
                                pagination: {
                                    count: data.length,
                                    page: 0,
                                    pageSize: 10
                                }
                            }}
                            showSearch={false}
                            columns={columns()}

                            // Colmunas que se pueden filtrar
                            filters={[

                            ]}

                            // función que obtiene los datos de la tabla
                            refetch={async (pagination: PaginationType, filter: { [key: string]: string }) => {
                                /* const {
                                    variants: view,
                                    search
                                } = filter */

                                const result = data.slice(
                                    pagination.page * pagination.pageSize,
                                    (pagination.page * pagination.pageSize) + pagination.pageSize
                                )

                                return [
                                    result, { ...pagination, count: pagination.count }
                                ]
                            }}

                            handleSelectItems={(items: Array<any>) => {

                            }}
                        />
                    </Card.Body>
                </Card.Root>
            </Stack>

            {/* Grafica por ordenes totales */}
            <Stack flex={1}>
                <Card.Root>
                    <Card.Header>
                        <Stack flex={1} gap={0}>
                            <Card.Title>Órdenes</Card.Title>
                            <Card.Description>
                                Comportamiento de ventas de ordenes
                            </Card.Description>
                        </Stack>
                    </Card.Header>
                    <Card.Body gap="2" mt={4}>
                        <CardLineChartOrderClient
                            dataLineCart={dataLineCartOrders}
                        />
                    </Card.Body>
                </Card.Root>
            </Stack>

            {/* Grafica por clientes */}
            <Stack flex={1}>
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Órdenes por Clientes</Card.Title>
                        <Card.Description>
                            Grafica el comportamiento de ordenes por clientes
                        </Card.Description>
                    </Card.Header>
                    <Card.Body gap="4">
                        <Stack>
                            <ClientMultipleSelector
                                data={data}
                                onChange={(values) => {
                                    setDataLineCartOrderClient(values as any)
                                }}
                            />
                        </Stack>
                        <Stack>
                            <CardLineChartOrderClient
                                dataLineCart={dataLineCartOrderClient}
                            />
                        </Stack>
                    </Card.Body>
                </Card.Root>
            </Stack>

            <Flex gap={4}>
                <Stack flex={1}>
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>Órdenes por Clientes</Card.Title>
                            <Card.Description>
                                Grafica el comportamiento de ordenes por clientes
                            </Card.Description>
                        </Card.Header>
                        <Card.Body gap="4">
                            <Stack>
                                <CardPieChartOrderClient
                                    dataPie={data_by_ranges}
                                />
                            </Stack>
                        </Card.Body>
                    </Card.Root>
                </Stack>
                <Stack flex={1} gap={4}>
                    {data_by_ranges.map((range, index) => (
                        <StatsCards key={index} label={`${range.name}`}
                            description={"Número de órdenes por rangos"}
                            value={range.value}
                            element={(
                                <Box
                                    bg={'teal.500'}
                                    p={"12px"}
                                    borderRadius={'full'}
                                    color={'white'}
                                    w={'40px'}
                                    h={'40px'}
                                >
                                    <LuPawPrint />
                                </Box>
                            )}
                            h={'100%'}
                        />
                    ))}
                </Stack>
            </Flex>


        </Stack>
    )
}

export default ClientsByOrders