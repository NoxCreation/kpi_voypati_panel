export const changeRangeInitMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  return [startDate, endDate]
}

export const changeRangeDates = (startDate: Date, endDate: Date) => {
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);
  endDate.setHours(23);
  endDate.setMinutes(59);
  endDate.setSeconds(59);
  endDate.setMilliseconds(999);
  return [startDate, endDate]
}

export const getFormatDate = (startDate: Date, endDate: Date) => {
  const newDateOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  } as any

  let startDateFormat = startDate.toLocaleString("en-US", newDateOptions).split(",")[0]
  startDateFormat = `${startDateFormat.split("/")[2]}-${startDateFormat.split("/")[0]}-${startDateFormat.split("/")[1]}`
  let endDateFormat = endDate.toLocaleString("en-US", newDateOptions).split(",")[0]
  endDateFormat = `${endDateFormat.split("/")[2]}-${endDateFormat.split("/")[0]}-${endDateFormat.split("/")[1]}`

  return [startDateFormat, endDateFormat]
}
