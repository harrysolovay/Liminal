import { ensureDir } from "@std/fs"
import * as path from "@std/path"

export function tap(useValue: <T>(value: T) => void) {
  return <T>(value: T): T => {
    useValue(value)
    return value
  }
}

export const dbg = tap(async (value) => {
  console.debug(value)
  await ensureDir(TMP_DIR)
  const dest = path.join(TMP_DIR, `${Date.now()}.json`)
  await Deno.writeTextFile(dest, JSON.stringify(value, null, 2))
  console.log(`Written to ${dest}.`)
})

const TMP_DIR = ".tmp"
