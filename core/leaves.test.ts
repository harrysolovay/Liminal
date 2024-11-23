import { bool, none, num, str } from "./leaves.ts"
import { assertTySnapshot } from "../test_util.ts"

Deno.test("bool", async (t) => {
  await assertTySnapshot(t, bool)
})

Deno.test("none", async (t) => {
  await assertTySnapshot(t, none)
})

Deno.test("num", async (t) => {
  await assertTySnapshot(t, num)
})

Deno.test("str", async (t) => {
  await assertTySnapshot(t, str)
})
