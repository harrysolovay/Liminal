import { assertTypeSnapshot } from "testing"
import { boolean } from "./boolean.ts"

Deno.test("boolean", async (t) => {
  await assertTypeSnapshot(t, boolean)
})
