import { Stack, Text, Table } from "@chakra-ui/react"
import { ColumnDef, flexRender, HeaderGroup } from "@tanstack/react-table"
import { SelectField } from "../SelectField"
import { PopoverFilter } from "../PopoverFilter"

export const HeadTable = ({
    filters,
    columns,
    getHeaderGroups,
    handleFilter
}: {
    filters?: Array<{
        column_id: string
        name: string
        values: Array<{
            id: string,
            label: string
        }>
    }>,
    columns: ColumnDef<any>[]
    getHeaderGroups: () => HeaderGroup<any>[]
    handleFilter: (filter: { [key: string]: string }) => void
}) => {

    // Devuelve todos los filtros que no estan en las columnas
    const filterFilters = () => {
        const columns_id = columns.filter(e => e.id != undefined).map(e => e.id)
        return filters?.filter(e => !columns_id.includes(e.column_id)) as Array<{
            column_id: string
            name: string
            values: Array<{
                id: string,
                label: string
            }>
        }>
    }

    const getFilters = (columnId: string) => {
        if (filters) {
            const find = filters.find(e => e.column_id == columnId)
            if (find) {
                const result = find?.values.map(e => ({
                    label: e.label,
                    value: e.id
                }))
                result.unshift({
                    label: "All",
                    value: ""
                })
                return result
            }
        }
        return []
    }

    return (
        <>
            <Table.Header>
                {getHeaderGroups().map((headerGroup) => (
                    <Table.Row key={headerGroup.id} >
                        {headerGroup.headers.map((header, i) => (
                            <Table.ColumnHeader key={header.id} p={1}>
                                {header.id !== "actions" ? (
                                    <Stack fontWeight={'bold'}>
                                        {columns[i].id ? (
                                            <>
                                                <SelectField
                                                    label={flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    ) as string}
                                                    placeholder="Search"
                                                    options={getFilters(columns[i].id)}
                                                    onChange={(val) => {
                                                        handleFilter({
                                                            [columns[i].id as string]: val
                                                        })
                                                    }}
                                                />
                                            </>
                                        ) : (
                                            <Text px={2}>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </Text>
                                        )}
                                    </Stack>
                                ) : (
                                    <>
                                        {filterFilters()?.length > 0 && <PopoverFilter
                                            filters={filterFilters()}
                                            handleFilter={handleFilter}
                                        />}
                                    </>

                                )}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                ))}
            </Table.Header>
        </>
    )
}