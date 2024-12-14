import { intersect } from "@std/collections"
import { gray, yellow } from "@std/fmt/colors"
import { ensureDir } from "@std/fs"
import { dirname, fromFileUrl, relative } from "@std/path"
import { splitLast } from "./splitLast.ts"
import { tap } from "./tap.ts"

export function dbg(...flags: Array<string>): <T>(value: T) => T {
  const enabled = Deno.env.get("LIMINAL_DBG")?.split(",").map((v) => v.trim())
  if (!enabled || !intersect([flags, enabled]).length) {
    return (value) => value
  }
  const path = relative(
    dirname(import.meta.dirname!),
    fromFileUrl(new URL(new Error().stack?.split("\n").pop()?.split("    at ").pop()!)),
  )
  const [leading, row] = splitLast(path, ":")!
  const [filename, col] = splitLast(leading, ":")!

  return tap(async (value) => {
    console.debug(yellow(path), value)
    const destDir = `${TMP_DIR}/${filename}_${col}_${row}`
    await ensureDir(destDir)
    const dest = `${destDir}/${Date.now()}.json`
    await Deno.writeTextFile(dest, JSON.stringify(value, null, 2))
    console.debug(gray(dest))
  })
}

const TMP_DIR = ".liminal/dbg"
