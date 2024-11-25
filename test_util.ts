import { assertSnapshot } from "@std/testing/snapshot"
import { T } from "./mod.ts"

export async function assertTySnapshot(
  t: Deno.TestContext,
  value: T.Ty<unknown, never>,
): Promise<void> {
  await assertSnapshot(t, maybeWrap(value).schema())
  const withContext = value`One.`
  await assertSnapshot(t, maybeWrap(withContext).schema())
  await assertSnapshot(t, maybeWrap(withContext`Two.`).schema())
}

function maybeWrap<T, P extends string>(value: T.Ty<T, P>) {
  if (!value.isRoot()) {
    return T.Wrapper(value)
  }
  return value
}
