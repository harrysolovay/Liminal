import { assertTypeSnapshot } from "testing"
import { option } from "./option.ts"
import { string } from "./string.ts"

Deno.test("option", async (t) => {
  await assertTypeSnapshot(t, option(string))
})
