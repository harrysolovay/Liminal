import { object } from "./object.ts"
import { assertTySnapshot } from "test_util"
import { boolean, number, string } from "./leaves.ts"

Deno.test("object", async (t) => {
  await assertTySnapshot(t, object({ a: boolean, b: number, c: string }))
})
