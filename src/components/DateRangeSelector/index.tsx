import {
  Input,
  Popover,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { es } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import {
  DateRangePicker,
  RangeKeyDict,
  Range,
} from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

type DateRange = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

interface Props {
  onChange?: (startDate: Date, endDate: Date) => void;
  value?: Array<Date>,
  isDisabled?: boolean
}

export default function DateRangeSelector({ isDisabled, value, onChange }: Props) {
  const defineds = {
    startOfWeek: startOfWeek(new Date()),
    endOfWeek: endOfWeek(new Date()),
    startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
    endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
    startOfToday: startOfDay(new Date()),
    endOfToday: endOfDay(new Date()),
    startOfYesterday: startOfDay(addDays(new Date(), -1)),
    endOfYesterday: endOfDay(addDays(new Date(), -1)),
    startOfMonth: startOfMonth(new Date()),
    endOfMonth: endOfMonth(new Date()),
    startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
    endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
  };

  const staticRangeHandler = {
    range: {},
    isSelected(range: Range) {
      const definedRange = (this.range as any)();
      return (
        isSameDay(range.startDate as Date, definedRange.startDate as Date) &&
        isSameDay(range.endDate as Date, definedRange.endDate as Date)
      );
    },
  };

  function createStaticRanges(ranges: any) {
    return ranges.map((range: any) => ({ ...staticRangeHandler, ...range }));
  }

  const defaultStaticRanges = createStaticRanges([
    {
      label: "Hoy",
      range: () => ({
        startDate: defineds.startOfToday,
        endDate: defineds.endOfToday,
      }),
    },
    {
      label: "Ayer",
      range: () => ({
        startDate: defineds.startOfYesterday,
        endDate: defineds.endOfYesterday,
      }),
    },
    {
      label: "Esta semana",
      range: () => ({
        startDate: defineds.startOfWeek,
        endDate: defineds.endOfWeek,
      }),
    },
    {
      label: "Semana pasada",
      range: () => ({
        startDate: defineds.startOfLastWeek,
        endDate: defineds.endOfLastWeek,
      }),
    },
    {
      label: "Este mes",
      range: () => ({
        startDate: defineds.startOfMonth,
        endDate: defineds.endOfMonth,
      }),
    },
    {
      label: "Mes pasado",
      range: () => ({
        startDate: defineds.startOfLastMonth,
        endDate: defineds.endOfLastMonth,
      }),
    },
  ]);

  const defaultInputRanges = [
    {
      label: 'Días desde hoy hacia atrás',
      range(value: any) {
        return {
          startDate: addDays(defineds.startOfToday, (Math.max(Number(value), 1) - 1) * -1),
          endDate: defineds.endOfToday,
        };
      },
      getCurrentValue(range: any) {
        if (!isSameDay(range.endDate, defineds.endOfToday)) return '-';
        if (!range.startDate) return '∞';
        return differenceInCalendarDays(defineds.endOfToday, range.startDate) + 1;
      },
    },
    {
      label: 'Días desde hoy hacia delante',
      range(value: any) {
        const today = new Date();
        return {
          startDate: today,
          endDate: addDays(today, Math.max(Number(value), 1) - 1),
        };
      },
      getCurrentValue(range: any) {
        if (!isSameDay(range.startDate, defineds.startOfToday)) return '-';
        if (!range.endDate) return '∞';
        return differenceInCalendarDays(range.endDate, defineds.startOfToday) + 1;
      },
    },
  ];

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });

  useEffect(() => {
    if (value)
      setDateRange({
        startDate: value[0],
        endDate: value[1],
      })
  }, [value])

  function handleChange(rangesByKey: RangeKeyDict) {
    const startDate = new Date(rangesByKey.selection.startDate as Date);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    const endDate = new Date(rangesByKey.selection.endDate as Date);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(999);

    if (startDate !== undefined && endDate !== undefined) {
      setDateRange({
        startDate,
        endDate,
      });
      onChange?.(startDate, endDate);
    }
  }

  //const [open, setOpen] = useState(false)

  const DateRangePickerAny = DateRangePicker as any

  return (
    <Popover.Root>
      <Popover.Trigger >
        <Flex w={'100%'}>
          <Input
            fontSize={"13px"}
            value={dateRange.startDate?.toLocaleDateString()}
            type="text"
            /* maxWidth={"150px"} */
            readOnly
            borderTopRightRadius={0}
            borderBottomRightRadius={0}
            disabled={isDisabled}
            /* onClick={() => setOpen(true)} */
            placeholder="1/6/2024"
            size={'sm'}
            px={2}
          />
          <Input
            fontSize={"13px"}
            type="text"
            value={dateRange.endDate?.toLocaleDateString()}
            borderTopLeftRadius={0}
            borderBottomLeftRadius={0}
            readOnly
            disabled={isDisabled}
            /* onClick={() => setOpen(true)} */
            placeholder="7/6/2024"
            size={'sm'}
            px={2}
          />
        </Flex>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content w={'fit-content'}>
          <Popover.CloseTrigger />
          <Popover.Arrow>
            <Popover.ArrowTip />
          </Popover.Arrow>
          <Popover.Body >
            <Popover.Title p={4}>Selecciona un rango de fechas</Popover.Title>
            <Stack>
              <DateRangePickerAny
                inputRanges={defaultInputRanges}
                staticRanges={defaultStaticRanges}
                ranges={[
                  {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                    key: "selection",
                  },
                ]}
                onChange={(e: any) => {
                  // setOpen(false)
                  handleChange(e)
                }}
                locale={es}
              />
            </Stack>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
}
