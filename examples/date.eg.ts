import { assert } from "@std/assert"
import { OpenAIAdapter } from "liminal/openai"
import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal, type Type } from "liminal"
import { dbg } from "testing"
import * as A from "./assertions.eg.ts"

const $ = Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const LDate: Type<Date> = L.transform(
  L.Tuple(
    L.number`Year.`,
    L.number`Month.`(
      A.number.min(0),
      A.number.max(11),
    ),
    L.number`Day.`(
      A.number.min(1),
      A.number.max(31),
    ),
  )(
    L.Assertion(
      "Ensure the day is valid for corresponding year and month.",
      (ymd) => assertValidYMD(...ymd),
    ),
  ),
  ([y, m, d]) => new Date(y, m, d),
)

await $(LDate).then(dbg)

// ...

function assertValidYMD(year: number, month: number, day: number) {
  const date = new Date(year, month, day)
  assert(
    date.getFullYear() === year && date.getMonth() === month && date.getDate() === day,
    `Day ${day} is invalid for month ${month} (${MONTHS[month]}).`,
  )
}
// dprint-ignore-next-line
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
