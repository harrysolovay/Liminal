import { assertTySnapshot } from "test_util"
import { string } from "../leaves.ts"
import { Wrapper } from "./Wrapper.ts"

Deno.test("Wrapper", async (t) => {
  await assertTySnapshot(t, Wrapper(string))
})
