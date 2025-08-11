"use client"

import { Box, Portal, Select, createListCollection } from "@chakra-ui/react"

// Adapted version for Municipio selection
import React from "react"

import type { FC } from "react"

type Option = { label: string; value: string }

interface SimpleSelectProps {
  label?: string
  required?: boolean
  error?: string
  options?: Option[]
  placeholder?: string
  value?: string
  onChange?: (val: string[]) => void
  disabled?: boolean
}

const SimpleSelect: FC<SimpleSelectProps> = ({
  label = "Municipio",
  required = false,
  error = "",
  options = [],
  placeholder = "Selecciona municipio",
  value = "",
  onChange = () => {},
  disabled = false,
}) => {
  const collection = createListCollection({ items: options })
  return (
    <div>
      <Select.Root
        collection={collection}
        size="sm"
        width="100%"
        required={required}
        disabled={disabled}
        value={value ? [value] : []}
        onValueChange={(e) => onChange(e.value)}
      >
        <Select.HiddenSelect />
        <Select.Label display={'flex'} gap={1}>{label} {required && <Box color={'red.500'}>*</Box>}</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder={placeholder} />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal >
          <Select.Positioner zIndex={1500}>
            <Select.Content zIndex={1500}>
              {options.map((item) => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      {error && (
        <div style={{ color: "red", fontSize: 12, marginTop: 4 }}>{error}</div>
      )}
    </div>
  )
}

export default SimpleSelect


