export function tap(operation: <T>(value: T) => void) {
  return <T>(value: T): T => {
    operation(value)
    return value
  }
}
