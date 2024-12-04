import { assert, asserts } from "../../util/mod.ts"
import type { Type } from "../Type.ts"
import { number, object, transform } from "../types.ts"

const ZeroBasedInteger = number.assert(asserts.number.min, 0)`Zero based.`

const YearMonthDay: Type<{
  year: number
  month: number
  day: number
}, never> = object({
  year: number,
  month: ZeroBasedInteger.assert(asserts.number.max, 11),
  day: number.assert(asserts.number.min, 1).assert(asserts.number.max, 31),
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
const Date_: Type<Date, never> = transform(
  object({
    yearMonthDay: YearMonthDay,
    hour: ZeroBasedInteger.assert(asserts.number.max, 23),
    minute: ZeroBasedInteger.assert(asserts.number.max, 59),
    second: ZeroBasedInteger.assert(asserts.number.max, 59),
    millisecond: ZeroBasedInteger
      .assert(asserts.number.max, 0)
      .assert(asserts.number.max, 999),
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
