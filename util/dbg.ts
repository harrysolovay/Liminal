import { ensureDir } from "../shim/ensureDir.ts"
import { env } from "../shim/env.ts"
import { writeTextFile } from "../shim/writeTextFile.ts"
import { tap } from "./tap.ts"

export function dbg(description?: string): <T>(value: T) => T {
  const enabled = env("STRUCTURED_OUTPUTS_DEBUG")
  if (!enabled) {
    return (value) => value
  }
  const leading = description ? `${description}:` : ""
  return tap(async (value) => {
    console.debug(leading, value)
    await ensureDir(TMP_DIR)
    const dest = `${TMP_DIR}/${Date.now()}.json`
    await writeTextFile(dest, JSON.stringify(value, null, 2))
    console.debug(leading, `Written to ${dest}.`)
  })
}

const TMP_DIR = ".structured_outputs"
