import * as T from "../core/mod.ts"
import type { Type } from "../Type.ts"

const _0To255 = T.number.refine({ min: 0, max: 255 })

export const Rgb: Type.Initial<[number, number, number]> = T.tuple(_0To255, _0To255, _0To255)

export const Hex: Type.Initial<string> = T.transform("Hex", Rgb, (rgb) => rgb.map(toHex).join(""))

function toHex(value: number): string {
  return value.toString(16).padStart(2, "0")
}
