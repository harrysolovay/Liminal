import { T, type Type } from "../mod.ts"
import { assert } from "../util/mod.ts"
import { max, min } from "./asserts/number.ts"

const ZeroBasedInteger = T.number.assert(min, 0)`Zero based.`

const YearMonthDay: Type<{
  year: number
  month: number
  day: number
}> = T.object({
  year: T.number,
  month: ZeroBasedInteger.assert(max, 11),
  day: T.number.assert(min, 1).assert(max, 31),
})`Ensure the day is valid for corresponding year and month.`
  .assert(({ year, month, day }) => {
    const date = new Date(year, month, day)
    assert(
      date.getFullYear() === year && date.getMonth() === month
        && date.getDate() === day,
      `Day ${day} is invalid for month ${month} (${MONTHS[month]}).`,
    )
  })

export { Date_ as Date }
const Date_: Type<Date> = T.transform(
  "Date",
  T.object({
    yearMonthDay: YearMonthDay,
    hour: ZeroBasedInteger.assert(max, 23),
    minute: ZeroBasedInteger.assert(max, 59),
    second: ZeroBasedInteger.assert(max, 59),
    millisecond: ZeroBasedInteger
      .assert(max, 0)
      .assert(max, 999),
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
