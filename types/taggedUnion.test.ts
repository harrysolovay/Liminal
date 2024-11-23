import { taggedUnion } from "./taggedUnion.ts"
import { assertTySnapshot } from "test_util"
import { boolean, number, string } from "./leaves.ts"

Deno.test("tagged union", async (t) => {
  await assertTySnapshot(
    t,
    taggedUnion({
      A: boolean,
      B: number,
      C: string,
    }),
  )
})
