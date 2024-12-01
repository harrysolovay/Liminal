import * as asserts from "../asserts/mod.ts"
import type { Type } from "../core/mod.ts"
import * as T from "../types/mod.ts"

const _0To255 = T.number`Ranging from 0 to 255.`
  .assert(asserts.number.min, 0)
  .assert(asserts.number.max, 255)

export const Hex: Type<string> = T
  .tuple(_0To255, _0To255, _0To255)
  .transform((rgb) => rgb.map((channel) => channel.toString(16).padStart(2, "0")).join(""))
