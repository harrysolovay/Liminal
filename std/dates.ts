import type { Type } from "../core/mod.ts"
import * as T from "../types/mod.ts"
import { assert } from "../util/mod.ts"

export const Year = T.number`Year.`

export const Month = T.number.refine({
  min: 0,
  max: 11,
})`Month.`

export const DayOfMonth = T.number.refine({
  min: 1,
  max: 31,
})`Day of month. Ensure valid for corresponding month if any.`

export const Hour = T.number.refine({
  min: 0,
  max: 23,
})`Hour.`

export const Minute = T.number.refine({
  min: 0,
  max: 59,
})`Minute.`

export const Second = T.number.refine({
  min: 0,
  max: 59,
})`Second.`

export const Millisecond = T.number.refine({
  min: 0,
  max: 999,
})`Millisecond.`

export { Date_ as Date }
const Date_: Type.Initial<Date> = T.transform(
  "Date",
  T.object({
    year: Year,
    month: Month,
    dayOfMonth: DayOfMonth,
    hour: Hour,
    minute: Minute,
    second: Second,
    millisecond: Millisecond,
  }),
  ({
    year,
    month,
    dayOfMonth,
    hour,
    minute,
    second,
    millisecond,
  }) => {
    const date = new Date(year, month, dayOfMonth, hour, minute, second, millisecond)
    assert(
      date.getFullYear() === year && date.getMonth() === month && date.getDate() === dayOfMonth,
      `Day ${dayOfMonth} is invalid for month ${MONTHS[month]}.`,
    )
    return date
  },
)`Date.`

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
