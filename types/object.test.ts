import { assertTypeSnapshot } from "testing"
import { boolean } from "./boolean.ts"
import { number } from "./number.ts"
import { object } from "./object.ts"
import { string } from "./string.ts"

Deno.test("object", async (t) => {
  await assertTypeSnapshot(
    t,
    object({
      a: boolean,
      b: number,
      c: string,
    }),
  )
})
