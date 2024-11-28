import { ensureDir } from "@std/fs"
import * as path from "@std/path"
import { assertSnapshot } from "@std/testing/snapshot"
import type { Type } from "./mod.ts"

export async function assertTySnapshot(
  t: Deno.TestContext,
  value: Type<any, any, never>,
): Promise<void> {
  await assertSnapshot(t, value.schema())
  const withContext = value`One.`
  await assertSnapshot(t, withContext.schema())
  await assertSnapshot(t, withContext`Two.`.schema())
}

export function tap(useValue: <T>(value: T) => void) {
  return <T>(value: T): T => {
    useValue(value)
    return value
  }
}

export const dbg = tap(async (value) => {
  await ensureDir(TMP_DIR)
  const dest = path.join(TMP_DIR, `${Date.now()}.json`)
  await Deno.writeTextFile(dest, JSON.stringify(value, null, 2))
  console.log(`Written to ${dest}.`)
})

const TMP_DIR = ".tmp"
