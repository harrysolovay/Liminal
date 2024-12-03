export function tap<T>(useValue?: (value: T) => void): (value: T) => T {
  return (value) => {
    useValue?.(value)
    return value
  }
}
