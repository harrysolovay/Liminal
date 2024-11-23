import { assertSnapshot } from "@std/testing/snapshot"
import { T } from "./mod.ts"

export async function assertTySnapshot(
  t: Deno.TestContext,
  value: T.Ty<unknown, never>,
): Promise<void> {
  await assertSnapshot(t, maybeWrap(value).schema())
  const withDescription = value`Description one.`
  await assertSnapshot(t, maybeWrap(withDescription).schema())
  await assertSnapshot(t, maybeWrap(withDescription`Description two.`).schema())
}

function maybeWrap<T, P extends string>(value: T.Ty<T, P>) {
  if (!value.isRoot()) {
    return T.Wrapper(value)
  }
  return value
}
