"use client"

import {
  Portal,
  Select,
  createListCollection,
  SelectControlProps,
  Stack,
  Span,
  Box,
} from "@chakra-ui/react"

export const CustomSelect = ({
  placeholder,
  options,
  ...props
}: {
  placeholder?: string
  options: Array<{
    label: string,
    description?: string,
    value: string
  }>
} & SelectControlProps) => {
  const frameworks = createListCollection({
    items: options,
  })

  return (
    <Select.Root {...props as any} collection={frameworks}>
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={placeholder} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {frameworks.items.length > 0 ? (
              frameworks.items.map((framework) => (
                <Select.Item item={framework} key={framework.value}>
                  <Stack gap="0">
                    <Select.ItemText>{framework.label}</Select.ItemText>
                    {framework.description && (
                      <Span color="fg.muted" textStyle="xs">
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