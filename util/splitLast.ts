export function splitLast(value: string, search: string): undefined | [string, string] {
  const i = value.lastIndexOf(search)
  if (i === -1) {
    return undefined
  }
  return [value.slice(0, i), value.slice(i + search.length)]
}
