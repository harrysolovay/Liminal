import { assertTypeSnapshot } from "testing"
import { boolean } from "./boolean.ts"
import { number } from "./number.ts"
import { string } from "./string.ts"
import { taggedUnion } from "./taggedUnion.ts"

Deno.test("tagged union", async (t) => {
  await assertTypeSnapshot(
    t,
    taggedUnion("type", {
      A: boolean,
      B: number,
      C: string,
    }),
  )
})
