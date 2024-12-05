import { T, type Type } from "../mod.ts"
import { max, min } from "./asserts/number.ts"

const ColorChannel = T.number`Ranging from 0 to 255.`
  .assert(min, 0)
  .assert(max, 255)

export const ColorChannels: Type<[number, number, number], never> = T.Tuple(
  ColorChannel,
  ColorChannel,
  ColorChannel,
)

export const ColorHex: Type<string> = T.transform(
  "ColorHex",
  ColorChannels,
  (rgb) => rgb.map((channel) => channel.toString(16).padStart(2, "0")).join(""),
)
