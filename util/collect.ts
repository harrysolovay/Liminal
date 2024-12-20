export async function collect<T>(iterable: AsyncIterable<T>): Promise<Array<T>> {
  const result: Array<T> = []
  for await (const item of iterable) {
    result.push(item)
  }
  return result
}
