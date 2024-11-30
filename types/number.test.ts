import { assertTypeSnapshot } from "testing"
import { number } from "./number.ts"

Deno.test("number", async (t) => {
  await assertTypeSnapshot(t, number)
})
