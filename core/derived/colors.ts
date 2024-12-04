import { asserts } from "../../util/mod.ts"
import type { Type } from "../Type.ts"
import { number, transform } from "../types.ts"
import { Tuple } from "./Tuple.ts"

const ColorChannel = number`Ranging from 0 to 255.`
  .assert(asserts.number.min, 0)
  .assert(asserts.number.max, 255)

export const ColorChannels: Type<[number, number, number], never> = Tuple(
  ColorChannel,
  ColorChannel,
  ColorChannel,
)

export const ColorHex: Type<string> = transform(
  "ColorHex",
  ColorChannels,
  (rgb) => rgb.map((channel) => channel.toString(16).padStart(2, "0")).join(""),
)
