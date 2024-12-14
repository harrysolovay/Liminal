import { assertSnapshot } from "@std/testing/snapshot"
import { L } from "./mod.ts"
import { toJSON } from "./toJSON.ts"
import type { Type } from "./Type.ts"

Deno.test("toJSON", async (t) => {
  await t.step("boolean", async (t) => {
    await assertTypeSnapshot(t, L.boolean)
  })

  await t.step("number", async (t) => {
    await assertTypeSnapshot(t, L.number)
  })

  await t.step("integer", async (t) => {
    await assertTypeSnapshot(t, L.integer)
  })

  await t.step("string", async (t) => {
    await assertTypeSnapshot(t, L.string)
  })

  await t.step("array", async (t) => {
    await assertTypeSnapshot(t, L.array(L.string))
  })

  await t.step("object", async (t) => {
    await assertTypeSnapshot(
      t,
      L.object({
        a: L.boolean,
        b: L.number,
        c: L.string,
      }),
    )
  })

  await t.step("option", async (t) => {
    await assertTypeSnapshot(t, L.Option(L.string))
  })

  await t.step("enum", async (t) => {
    await assertTypeSnapshot(t, L.enum("A", "B", "C"))
  })

  await t.step("tagged union", async (t) => {
    await assertTypeSnapshot(
      t,
      L.TaggedUnion({
        A: L.boolean,
        B: L.number,
        C: L.string,
      }),
    )
  })
})

async function assertTypeSnapshot(t: Deno.TestContext, value: Type<unknown, never>): Promise<void> {
  await assertSnapshot(t, toJSON(value))
  const withContext = value`One.`
  await assertSnapshot(t, toJSON(withContext))
  await assertSnapshot(t, toJSON(withContext`Two.`))
}
