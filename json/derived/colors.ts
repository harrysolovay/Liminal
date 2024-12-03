import type { Type } from "../../core/mod.ts"
import { asserts } from "../../util/mod.ts"
import { number, transform } from "../combinators.ts"
import { Tuple } from "./Tuple.ts"

const _0To255 = number`Ranging from 0 to 255.`
  .assert(asserts.number.min, 0)
  .assert(asserts.number.max, 255)

export const Rgb: Type<[number, number, number], never> = Tuple(_0To255, _0To255, _0To255)

export const Hex: Type<string> = transform(
  "RgbToHex",
  Rgb,
  (rgb) => rgb.map((channel) => channel.toString(16).padStart(2, "0")).join(""),
)
