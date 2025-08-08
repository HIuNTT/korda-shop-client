import dayjs from "dayjs"

const DATE_FORMAT = "DD/MM/YYYY"

export function formatToDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format)
}
