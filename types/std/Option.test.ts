import { option } from "./Option.ts"
import { assertTySnapshot } from "test_util"
import { string } from "../leaves.ts"

Deno.test("Option", async (t) => {
  await assertTySnapshot(t, option(string))
})
