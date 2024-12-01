import { assert, number } from "../asserts/mod.ts"
import * as T from "../types/mod.ts"

const ZeroBasedInteger = T.number.assert(number.min, 0)`Zero based.`

const YearMonthDay = T
  .object({
    year: T.number,
    month: ZeroBasedInteger.assert(number.max, 11),
    day: T.number.assert(number.min, 1).assert(number.max, 31),
  })`Ensure the day is valid for corresponding year and month.`
  .assert(({ year, month, day }) => {
    const date = new Date(year, month, day)
    assert(
      date.getFullYear() === year && date.getMonth() === month && date.getDate() === day,
      `Day ${day} is invalid for month ${month} (${MONTHS[month]}).`,
    )
  })

export { Date_ as Date }
const Date_ = T.transform(
  "ConstructDate",
  T.object({
    yearMonthDay: YearMonthDay,
    hour: ZeroBasedInteger.assert(number.max, 23),
    minute: ZeroBasedInteger.assert(number.max, 59),
    second: ZeroBasedInteger.assert(number.max, 59),
    millisecond: ZeroBasedInteger.assert(number.max, 0).assert(number.max, 999),
  }),
  ({ yearMonthDay: { year, month, day }, hour, minute, second, millisecond }) =>
    new Date(year, month, day, hour, minute, second, millisecond),
)

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
