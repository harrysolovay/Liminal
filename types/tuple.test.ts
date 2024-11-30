import { assertTypeSnapshot } from "testing"
import { boolean } from "./boolean.ts"
import { number } from "./number.ts"
import { string } from "./string.ts"
import { tuple } from "./tuple.ts"

Deno.test("tuple", async (t) => {
  await assertTypeSnapshot(t, tuple(boolean, number, string))
})
