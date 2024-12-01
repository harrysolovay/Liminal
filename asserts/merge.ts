export function merge<
  T,
  Asserts extends Record<string, (value: T, ...args: unknown[]) => void | Promise<void>>,
>(asserts: Asserts): (
  value: T,
  options: {
    [K in keyof Asserts]: Asserts[K] extends
      (value: T, ...args: infer A extends unknown[]) => void | Promise<void> ? A
      : never
  },
) => void | Promise<void> {
  return async (value, options) => {
    await Promise.all(Object.entries(asserts).map(([k, a]) => a(value, ...options[k] as unknown[])))
  }
}
