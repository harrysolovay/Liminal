import { constant } from "./constant.ts"
import { assertTySnapshot } from "test_util"

Deno.test("constant num", async (t) => {
  await assertTySnapshot(t, constant("Hello"))
})

Deno.test("constant str", async (t) => {
  await assertTySnapshot(t, constant(42))
})
