import { declareRune } from "../_declareRune.ts"
import type { Runic } from "../_Rune.ts"
import type { Thread } from "../Thread.ts"

export function declareThread<T>(self: () => Runic<Thread<T>>, args?: Array<unknown>): Thread<T> {
  return declareRune("Thread", self, args)
}
