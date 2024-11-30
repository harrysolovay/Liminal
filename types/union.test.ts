import { assertTypeSnapshot } from "testing"
import { boolean } from "./boolean.ts"
import { number } from "./number.ts"
import { string } from "./string.ts"
import { union } from "./union.ts"

Deno.test("union", async (t) => {
  await assertTypeSnapshot(t, union(boolean, number, string))
})
