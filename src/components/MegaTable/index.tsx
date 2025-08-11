import { Flex, Stack, Table, Text } from "@chakra-ui/react";
import { ColumnDef, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { HeadTable } from "./components/HeadTable";
import { BodyTable } from "./components/BodyTable";
import { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from "react";
import { BodyLoading } from "./components/BodyLoading";
import { PaginationType } from "./components/Types/PaginationType";
import { PaginationMain } from "./components/Pagination";
import TableFilterCount from "./components/TableFilterCount";

interface Props<T> {
    columns: ColumnDef<T>[];
    filters?: Array<{
        column_id: string
        name: string,
        values: Array<{
            id: string,
            label: string
        }>
    }>
    showSearch?: boolean
    initialice?: {
        data?: Array<any>
        pagination?: PaginationType
    }

    refetch: (pagination: PaginationType, filter: { [key: string]: string }) => Promise<[Array<any>, PaginationType]>
    handleSelectItems?: (items: Array<any>) => void;
}

export interface MegaTableHandle {
    pagination: PaginationType
    refresh: (page?: number, pageSize?: number) => void;
    forceUpdateData: (data: Array<any>, pagination?: PaginationType) => void
}

export const MegaTable = forwardRef<MegaTableHandle, Props<any>>((
    { columns, filters, showSearch = false, initialice, refetch, handleSelectItems },
    ref
) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(initialice?.data ? initialice.data : [] as Array<any>)
    const [filter, setFilter] = useState({} as { [key: string]: string })
    const [search, setSearch] = useState("")
    const [pagination, setPagination] = useState({
        count: 0,
        page: 0,
        pageSize: 10
    } as PaginationType)

    const { getRowModel, getHeaderGroups, getSelectedRowModel, toggleAllRowsSelected } = useReactTable({
        data: data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableExpanding: true,
        enableRowSelection: true,
    });

    // Cuando se elije una fila
    useEffect(() => {
        if (handleSelectItems)
            handleSelectItems(getSelectedRowModel().rows.map((t) => t.original));
    }, [getSelectedRowModel()]);

    // Si cambian los datos, dejar de seleccionar
    useEffect(() => {
        toggleAllRowsSelected(false)
    }, [data])

    // Carga de datos
    const onLoad = async (pagination: PaginationType, filter: {
        [key: string]: string
    }) => {
        setLoading(true)
        const [data, new_pagination] = await refetch(pagination, filter)
        setData(data)
        setPagination(new_pagination)
        setLoading(false)
    }

    // Cuando se selecciona una pagina
    const handlePageSelect = (page: number) => {
        setPagination({
            ...pagination,
            page
        })
        onLoad({
            ...pagination,
            page
        }, filter)
    }

    // Cuando se selecciona el tamaño del paginado
    /* const handlePageSizeSelect = (pageSize: number) => {
        setPagination({
            ...pagination,
            page: 0,
            pageSize
        })
        onLoad({
            ...pagination,
            page: 0,
            pageSize
        }, filter)
    } */

    // Cuando se filtra
    const handleFilter = (newFilter: { [key: string]: string }) => {
        setFilter({
            ...filter,
            ...newFilter
        })
        onLoad({
            ...pagination,
            page: 0
        }, {
            ...filter,
            ...newFilter
        })
    }

    // Carga por defecto
    useEffect(() => {
        // Si hay inicializacion
        if (initialice)
            // Si hay datos de inicio
            if (initialice?.data) {
                // Y hay paginacion
                if (initialice.pagination) {
                    // Solo actualizar paginacion
                    setPagination(initialice.pagination)
                    return
                }
            }
            // Pero si no hay datos de arranque
            else {
                // Y hay inicializacion de paginacion
                if (initialice.pagination) {
                    // Arrancar con paginacion
                    onLoad(initialice.pagination, filter)
                    return
                }
            }
        //Arrancar de cero
        onLoad(pagination, filter)
    }, [])

    // Exponiendo al componente padre
    useImperativeHandle(ref, () => ({
        pagination: pagination,
        refresh: (page?: number, pageSize?: number) => {
            onLoad({
                ...pagination,
                page: page ? page : pagination.page,
                pageSize: pageSize ? pageSize : pagination.pageSize,
            }, filter);
        },
        forceUpdateData: (data: Array<any>, pagination?: PaginationType) => {
            setData(data)
            if (pagination)
                setPagination(pagination)
        }
    }));

    const tableElement = (
        <Table.Root variant={'outline'}>
            <HeadTable
                filters={filters}
                columns={columns}
                getHeaderGroups={getHeaderGroups}
                handleFilter={handleFilter}
            />
            {!loading ? (
                <BodyTable
                    search={search}
                    setSearch={setSearch}
                    showSearch={showSearch}
                    columnCount={columns.length}
                    getRowModel={getRowModel}
                    handleFilter={handleFilter}
                />
            ) : (
                <BodyLoading
                    getHeaderGroups={getHeaderGroups}
                />
            )}
        </Table.Root>
    )

    const paginationElement = (
        <Fragment>
            {data.length > 0 && (
                <PaginationMain
                    count={pagination.count}
                    page={pagination.page}
                    pageSize={pagination.pageSize}
                    onPageSelect={handlePageSelect}
                />
            )}
        </Fragment>
    );

    return (
        <Stack alignItems={'end'} w={'100%'}>
            {tableElement}
            <Flex gap={2} alignItems={'center'}>
                <Text fontSize={'12px'}>Filas Por Páginas:</Text>
                <TableFilterCount
                    /* count={pagination.pageSize} */
                    /* onChangeFilterCount={handlePageSizeSelect} */
                />
                {paginationElement}
            </Flex>
        </Stack>
    )
})
MegaTable.displayName = "MegaTable";

// confierte filter en un string para peticion get (parametros get)
export const getParamsFilter = (filter: {
    [key: string]: string
}) => {
    let result = ""
    Object.keys(filter).map((key, index) => {
        if (index == 0)
            result += `?${key}=${filter[key]}`
        else
            result += `&${key}=${filter[key]}`
    })
    return result
}

