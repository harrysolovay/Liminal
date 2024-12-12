export function isPromise(value: unknown): value is Promise<unknown> {
  return (
    value !== null
    && (typeof value === "object" || typeof value === "function")
    && "then" in value && typeof value.then === "function"
    && "catch" in value && typeof value.catch === "function"
  )
}
