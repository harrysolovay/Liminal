import type { Rune } from "../Rune.ts"
export * as Type from "./_intrinsic.ts"

export interface Type<T = any> extends Rune<"Type", T> {
  description(): undefined | string
}
