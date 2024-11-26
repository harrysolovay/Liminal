import { object } from "../object.ts"
import { number } from "../primitives.ts"
import { transform } from "../transform.ts"

export const Rgb = object({
  r: number`Between 0 and 255`,
  g: number`Between 0 and 255`,
  b: number`Between 0 and 255`,
})

export const Hex = transform(Rgb, ({ r, g, b }) => `${toHex(r)}${toHex(g)}${toHex(b)}"`)

function toHex(value: number): string {
  return value.toString(16).padStart(2, "0")
}
