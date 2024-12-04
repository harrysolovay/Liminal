export function splitLast(value: string, search: string): [string, string?] {
  const lastI = value.lastIndexOf(search)
  if (lastI === -1) {
    return [value]
  }
  return [value.slice(0, lastI), value.slice(lastI + search.length)]
}
