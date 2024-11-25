import { assertTySnapshot } from "test_util"
import { boolean, none, number, string } from "./primitives.ts"

Deno.test("boolean", async (t) => {
  await assertTySnapshot(t, boolean)
})

Deno.test("none", async (t) => {
  await assertTySnapshot(t, none)
})

Deno.test("number", async (t) => {
  await assertTySnapshot(t, number)
})

Deno.test("string", async (t) => {
  await assertTySnapshot(t, string)
})
