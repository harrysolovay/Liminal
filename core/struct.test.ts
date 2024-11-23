import { struct } from "./struct.ts"
import { assertTySnapshot } from "../test_util.ts"
import { bool, num, str } from "./leaves.ts"

Deno.test("struct", async (t) => {
  await assertTySnapshot(t, struct({ a: bool, b: num, c: str }))
})
