import type { Rune } from "../Rune.ts"

export interface Thread<T = any, E = any> extends Rune<"Thread", T> {
  E: E
}
