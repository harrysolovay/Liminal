import { assertTypeSnapshot } from "testing"
import { enum as enum_ } from "./enum.ts"

Deno.test("enum", async (t) => {
  await assertTypeSnapshot(t, enum_("A", "B", "C"))
})
