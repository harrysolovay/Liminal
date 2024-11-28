import { assertTySnapshot } from "test_util"
import { array } from "./array.ts"
import { string } from "./primitives.ts"

Deno.test("array", async (t) => {
  await assertTySnapshot(t, array(string))
})
