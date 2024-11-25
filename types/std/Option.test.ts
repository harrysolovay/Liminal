import { assertTySnapshot } from "test_util"
import { string } from "../primitives.ts"
import { option } from "./Option.ts"

Deno.test("Option", async (t) => {
  await assertTySnapshot(t, option(string))
})
