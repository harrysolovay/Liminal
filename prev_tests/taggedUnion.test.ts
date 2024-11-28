import { assertTySnapshot } from "test_util"
import { boolean, number, string } from "./primitives.ts"
import { taggedUnion } from "./taggedUnion.ts"

Deno.test("tagged union", async (t) => {
  await assertTySnapshot(
    t,
    taggedUnion("type", {
      A: boolean,
      B: number,
      C: string,
    }),
  )
})
