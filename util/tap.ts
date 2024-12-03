export function tap<T>(useValue?: (value: T) => void) {
  return (value: T): T => {
    useValue?.(value)
    return value
  }
}
