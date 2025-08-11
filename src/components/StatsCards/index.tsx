import {
    Box,
    Card,
    Flex,
    Text,
    VStack,
    CardRootProps
} from '@chakra-ui/react'
import React from 'react'

type Props = {
    select?: boolean
    label: string,
    value: number | string,
    description?: string,
    element?: React.ReactNode
} & CardRootProps

export default function StatsCards(
    {
        select,
        label,
        value,
        description,
        element,
        ...props
    }: Props
) {
    return (
        <Card.Root p={4} w={"full"} bgGradient={"white"} border={select ? '4px solid' : 'none'} borderColor={'orange.200'} {...props}>
            <Flex justifyContent={"space-between"} alignItems={"center"}>
                <VStack align="start" gap={1}>
                    <Text
                        fontSize="12px"
                        fontWeight={'500'}
                        color="gray.600"
                    >
                        {label}
                    </Text>
                    <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color="gray.600"
                    >
                        {value}
                    </Text>
                    {description && <Text
                        fontSize="10px"
                        fontWeight="light"
                        color="gray.400"
                    >
                        {description}
                    </Text>}
                </VStack>
                <Box>{element && element}</Box>
            </Flex>
        </Card.Root>
    )
}