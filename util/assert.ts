import { AssertionError } from "./AssertionError.ts"

export function assert(expr: unknown, msg?: string): asserts expr {
  if (!expr) {
    throw new AssertionError(msg)
  }
}
