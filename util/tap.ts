export function tap(useValue: <T>(value: T) => void) {
  return <T>(value: T): T => {
    useValue(value)
    return value
  }
}
