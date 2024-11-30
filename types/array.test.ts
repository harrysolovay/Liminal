import { assertTypeSnapshot } from "testing"
import { array } from "./array.ts"
import { string } from "./string.ts"

Deno.test("array", async (t) => {
  await assertTypeSnapshot(t, array(string))
})
