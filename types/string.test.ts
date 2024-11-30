import { assertTypeSnapshot } from "testing"
import { string } from "./string.ts"

Deno.test("string", async (t) => {
  await assertTypeSnapshot(t, string)
})
