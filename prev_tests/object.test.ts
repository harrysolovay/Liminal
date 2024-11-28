import { assertTySnapshot } from "test_util"
import { object } from "./object.ts"
import { boolean, number, string } from "./primitives.ts"

Deno.test("object", async (t) => {
  await assertTySnapshot(
    t,
    object({
      a: boolean,
      b: number,
      c: string,
    }),
  )
})
