import { Input, Table } from "@chakra-ui/react"
import { flexRender, RowModel } from "@tanstack/react-table"

export const BodyTable = ({
    search,
    setSearch,
    showSearch,
    columnCount,
    getRowModel,
    handleFilter
}: {
    search: string
    setSearch: (search: string) => void
    showSearch: boolean
    columnCount: number
    getRowModel: () => RowModel<any>
    handleFilter: (filter: { [key: string]: string }) => void
}) => {

    return (
        <Table.Body>
            {showSearch && <Table.Row >
                <Table.Cell colSpan={columnCount} >
                    <Input value={search} size="sm" placeholder="Search ..."
                        onKeyDown={e => {
                            if (e.key == 'Enter') {
                                handleFilter({ search: (e.target as any).value })
                            }
                        }}
                        onChange={e => setSearch(e.target.value)}
                    />
                </Table.Cell>
            </Table.Row >}
            {getRowModel().rows.map((row) => (
                <Table.Row key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                        <Table.Cell p={1} key={cell.id} bg={((cell.row.original as any).verified || (cell.row.original as any).verified == undefined) ? '' : '#faf8f2 !important'}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Table.Cell>
                    ))}
                </Table.Row>
            ))}
            {getRowModel().rows.length == 0 && (
                <Table.Cell colSpan={columnCount} textAlign={'center'} >NO DATA</Table.Cell>
            )}
        </Table.Body>
    )
}