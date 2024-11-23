import { Option } from "./Option1.ts"
import { assertTySnapshot } from "../test_util.ts"
import { str } from "../core/mod.ts"

Deno.test("Option", async (t) => {
  await assertTySnapshot(t, Option(str))
})
