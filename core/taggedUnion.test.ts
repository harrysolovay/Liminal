import { taggedUnion } from "./taggedUnion.ts"
import { assertTySnapshot } from "../test_util.ts"
import { bool, num, str } from "./leaves.ts"

Deno.test("tagged union", async (t) => {
  await assertTySnapshot(t, taggedUnion({ A: bool, B: num, C: str }))
})
