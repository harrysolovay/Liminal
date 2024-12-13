import { L, type Type } from "../mod.ts"
import { max, min } from "./assertions.eg.ts"

export const ColorHex: Type<string, never> = L.transform(
  L.Tuple.N(L.number(min(0), max(255)), 3),
  (rgb) => rgb.map((channel) => channel.toString(16).padStart(2, "0")).join(""),
)
