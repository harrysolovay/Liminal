import { object } from "../object.ts"
import { number } from "../primitives.ts"
import { transform } from "../transform.ts"
import type { Ty } from "../Ty.ts"

export { Date_ as Date }
const Date_: Ty<Date, never, true> = transform(
  object({
    year: number,
    month: number`Zero-based (0 for January, 11 for December).`,
    day: number`Day of the month (1-31). Ensure within available range for the specified month.`,
    hour: number`Zero-based (0-23)`,
    minute: number`Zero-based (0-59)`,
    second: number`Zero-based (0-59)`,
    millisecond: number`Zero-based (0-999)`,
  }),
  ({ year, month, day, hour, minute, second, millisecond }) =>
    new Date(year, month, day, hour, minute, second, millisecond),
)
