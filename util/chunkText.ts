import { assert } from "@std/assert"

export function chunkText(text: string, chunkSize = 1000, overlap = 200): Array<string> {
  assert(!(chunkSize % 2), "`chunkSize` must be divisible by `2`.")
  const chunks: Array<string> = []
  let i = 0
  while (i < text.length) {
    const endIndex = Math.min(i + chunkSize, text.length)
    const chunk = text.slice(i, endIndex)
    chunks.push(chunk)
    i += chunkSize - overlap
  }
  return chunks
}
