import { intersect } from "@std/collections"
import { gray, yellow } from "@std/fmt/colors"
import { ensureDir } from "@std/fs"
import { relative } from "@std/path"
import { splitLast } from "../util/splitLast.ts"

export function dbg<T>(value: T, ...flags: Array<string>): T {
  const enabled = Deno.env.get("LIMINAL_DBG")?.split(",").map((v) => v.trim())
  if (enabled && (!flags.length || intersect([flags, enabled]).length)) {
    tap()
  }
  return value

  async function tap() {
    const path = relative(
      Deno.cwd(),
      new Error().stack?.split("\n").pop()?.split("file://").pop()!,
    )
    const [leading, row] = splitLast(path, ":")!
    const [filename, col] = splitLast(leading, ":")!
    console.debug(yellow(path))
    console.debug(value)
    const destDir = `${TMP_DIR}/${filename}/${Date.now()}`
    await ensureDir(destDir)
    const dest = `${destDir}/${col}_${row}.json`
    await Deno.writeTextFile(dest, JSON.stringify(value, null, 2))
    console.debug(gray(dest))
  }
}

const TMP_DIR = ".liminal/dbg"
