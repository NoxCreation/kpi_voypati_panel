import { Box, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Flex, Stack } from "@chakra-ui/react"
import { SelectField } from "../SelectField"
import { TbFilterPlus } from "react-icons/tb"
import { BtnOption } from "../BtnOption"

export const PopoverFilter = ({
    filters,
    handleFilter
}: {
    filters: Array<{
        column_id: string
        name: string
        values: Array<{
            id: string,
            label: string
        }>
    }>
    handleFilter: (filter: { [key: string]: string }) => void
}) => {

    return (
        <Popover.Root >
            <PopoverTrigger>
                <Box textAlign={'end'}>
                    <BtnOption
                        size={'sm'}
                        label="More Filters"
                        icon={<TbFilterPlus />}
                        color={'gray.600'}
                        colorScheme="gray.50"
                    />
                </Box>
            </PopoverTrigger>
            <PopoverContent fontWeight={'normal'} w={'fit-content'}>
                <PopoverArrow />
                <PopoverBody >
                    <Flex>
                        {filters.map((filter, index) => (
                            <FilterForm
                                key={index}
                                column_id={filter.column_id}
                                name={filter.name}
                                values={filter.values}
                                handleFilter={handleFilter}
                            />
                        ))}
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </Popover.Root>
    )
}

const FilterForm = ({
    column_id,
    name,
    values,
    handleFilter
}: {
    column_id: string
    name: string
    values: Array<{
        id: string,
        label: string
    }>
    handleFilter: (filter: { [key: string]: string }) => void
}) => {
    return (
        <Stack minW={'150px'}>
            {/* <FormLabel>{name}</FormLabel> */}
            <SelectField
                label={name}
                placeholder="Search"
                options={[
                    {
                        label: 'All',
                        value: ''
                    },
                    ...values.map(e => ({
                        label: e.label,
                        value: e.id
                    }))
                ]}
                onChange={(val) => {
                    handleFilter({
                        [column_id]: val
                    })
                }}
            />
        </Stack>
    )
}
