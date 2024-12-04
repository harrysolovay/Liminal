import { ensureDir } from "./fs/ensureDir.ts"
import { writeTextFile } from "./fs/writeTextFile.ts"
import { tap } from "./tap.ts"

export const dbg: <T>(value: T) => T = tap(async (value) => {
  console.debug(value)
  await ensureDir(TMP_DIR)
  const dest = `${TMP_DIR}${Date.now()}.json`
  await writeTextFile(dest, JSON.stringify(value, null, 2))
  console.log(`Written to ${dest}.`)
})

const TMP_DIR = ".structured_outputs"
