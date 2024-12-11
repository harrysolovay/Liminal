export function assert(expr: unknown, msg?: string): asserts expr {
  if (!expr) {
    throw new AssertionError(msg)
  }
}

export class AssertionError extends Error {
  override readonly name = "AssertionError"
}
