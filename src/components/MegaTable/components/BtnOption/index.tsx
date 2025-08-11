import { Tooltip } from "@/components/Tooltip"
import { IconButton, ButtonProps } from "@chakra-ui/react"

type Props = {
    label: string
    icon: any
    colorScheme?: string
    onClick?: () => void
} & ButtonProps

export const BtnOption = ({
    label,
    icon,
    colorScheme,
    onClick,
    ...props
}: Props) => {
    return (
        <Tooltip content={label}>
            <IconButton {...props} colorScheme={colorScheme} aria-label={label} onClick={onClick} >
                {icon}
            </IconButton>
        </Tooltip>
    )
}