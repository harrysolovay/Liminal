import { assert } from "@std/assert"
import { L, type Type } from "../mod.ts"

const min = L.assertion((min) => `Must be gte ${min}.`, assertMin)
const max = L.assertion((max) => `Must be lte ${max}.`, assertMax)
const ymd = L.assertion(
  "Ensure the day is valid for corresponding year and month.",
  (ymd: [number, number, number]) => assertValidYMD(...ymd),
)

export const LDate: Type<Date, never> = L.transform(
  L.Tuple(
    L.number`Year.`,
    L.number`Month.`(min(0), max(11)),
    L.number`Day.`(min(0), max(31)),
  )(ymd()),
  ([y, m, d]) => new Date(y, m, d),
)

function assertMin(value: number, min: number) {
  assert(value >= min, `Must be gte ${min}; received ${value}.`)
}

function assertMax(value: number, max: number) {
  assert(value <= max, `Must be lte ${max}; received ${value}.`)
}

function assertValidYMD(year: number, month: number, day: number) {
  const date = new Date(year, month, day)
  assert(
    date.getFullYear() === year && date.getMonth() === month && date.getDate() === day,
    `Day ${day} is invalid for month ${month} (${MONTHS[month]}).`,
  )
}
// dprint-ignore-next-line
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
