import { assertTySnapshot } from "test_util"
import { boolean, number, string } from "./primitives.ts"
import { tuple } from "./tuple.ts"

Deno.test("tuple", async (t) => {
  await assertTySnapshot(t, tuple(boolean, number, string))
})
