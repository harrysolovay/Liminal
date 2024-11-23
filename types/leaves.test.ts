import { boolean, none, number, string } from "./leaves.ts"
import { assertTySnapshot } from "test_util"

Deno.test("bool", async (t) => {
  await assertTySnapshot(t, boolean)
})

Deno.test("none", async (t) => {
  await assertTySnapshot(t, none)
})

Deno.test("num", async (t) => {
  await assertTySnapshot(t, number)
})

Deno.test("str", async (t) => {
  await assertTySnapshot(t, string)
})
