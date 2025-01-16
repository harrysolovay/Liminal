import { declareRune } from "../_declareRune.ts"
import type { Thread } from "../Thread.ts"

export function declareThread<T>(
  self: () => Thread | ((...args: any) => Thread),
  args?: Array<unknown>,
): Thread<T> {
  return declareRune("Thread", self, args)
}
