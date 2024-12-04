import { writeFile } from "node:fs/promises"

export async function writeTextFile(
  path: string | URL,
  data: string | ReadableStream<string>,
): Promise<void> {
  await writeFile(path, data, { encoding: "utf8" })
}
