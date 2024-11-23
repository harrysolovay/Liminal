import { constantUnion } from "./constantUnion.ts"
import { assertTySnapshot } from "../test_util.ts"

Deno.test("constant union", async (t) => {
  await assertTySnapshot(t, constantUnion("Hello", "world!", 42, 420))
})
