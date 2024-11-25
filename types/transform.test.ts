import { assertEquals } from "@std/assert"
import { assertTySnapshot } from "test_util"
import { object } from "./object.ts"
import { string } from "./primitives.ts"
import { transform } from "./transform.ts"

Deno.test("transform", async (t) => {
  const unwrap = transform(object({ value: string }), ({ value }) => value)
  await assertTySnapshot(t, unwrap)
  assertEquals(unwrap[""].transform({ value: "Hello!" }), "Hello!")
})
