"use client"

import {
    Portal,
    Select,
    createListCollection,
    SelectControlProps,
    Stack,
    Span,
    Input,
    Box,
} from "@chakra-ui/react"
import { useState, useMemo } from "react"

export const SelectField = ({
    defaultValue,
    label,
    placeholder,
    options,
    onChange,
    ...props
}: {
    defaultValue?: string
    label?: string
    placeholder?: string
    options: Array<{
        label: string,
        description?: string,
        value: string
    }>
    onChange: (e: any) => void
} & SelectControlProps) => {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredOptions = useMemo(() => {
        return options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase())))
    }, [options, searchTerm])

    const frameworks = createListCollection({
        items: filteredOptions,
    })

    return (
        <Select.Root {...props as any} collection={frameworks} defaultValue={defaultValue} onChange={onChange}>
            <Select.HiddenSelect />
            <Select.Label>{label}</Select.Label>
            <Select.Control >
                <Select.Trigger px={2}>
                    <Select.ValueText placeholder={placeholder} />
                </Select.Trigger>
                <Select.IndicatorGroup px={2}>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content zIndex={999999} position={'relative'}>
                        {/* Input de búsqueda con prevención de eventos */}
                        <Box
                            p={2}
                            borderBottomWidth="1px"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            zIndex={8888}
                            position={"relative"}
                        >
                            <Input
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                variant="subtle"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                    // Permitir teclas de navegación
                                    if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
                                        e.stopPropagation()
                                    }
                                }}
                                px={2}
                            />
                        </Box>

                        {/* Opciones filtradas */}
                        {frameworks.items.length > 0 ? (
                            frameworks.items.slice(0, 10).map((framework) => (
                                <Select.Item item={framework} key={framework.value}>
                                    <Stack gap="0" py={1}>
                                        <Select.ItemText px={2}>{framework.label}</Select.ItemText>
                                        {framework.description && (
                                            <Span color="fg.muted" textStyle="xs" px={2}>
                                                {framework.description}
                                            </Span>
                                        )}
                                    </Stack>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))
                        ) : (
                            <Box p={3} textAlign="center" color="fg.muted">
                                No se encontraron resultados
                            </Box>
                        )}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    )
}