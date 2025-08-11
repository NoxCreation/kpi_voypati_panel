import { Skeleton, Table } from "@chakra-ui/react"
import { HeaderGroup } from "@tanstack/react-table"
import { Fragment } from "react"

export const BodyLoading = ({
    getHeaderGroups,
}: {
    getHeaderGroups: () => HeaderGroup<any>[]
}) => {

    return (
        <Fragment>
            {Array.from({ length: 6 }).map((_, i) => (
                <Fragment key={i}>
                    {getHeaderGroups().map((headerGroup) => (
                        <Table.Row key={headerGroup.id}>
                            {headerGroup.headers.map((header,) => (
                                <Table.Cell key={header.id}>
                                    <Skeleton w={'100px'} h={'20px'} />
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Fragment>
            ))}
        </Fragment>
    )
}