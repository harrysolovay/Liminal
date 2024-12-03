import { assertSnapshot } from "@std/testing/snapshot"
import * as T from "./T.ts"
import { toSchema } from "./toSchema.ts"
import type { Type } from "./Type.ts"

Deno.test("toSchema", async (t) => {
  await t.step("boolean", async (t) => {
    await assertTypeSnapshot(t, T.boolean)
  })

  await t.step("number", async (t) => {
    await assertTypeSnapshot(t, T.number)
  })

  await t.step("integer", async (t) => {
    await assertTypeSnapshot(t, T.Integer)
  })

  await t.step("string", async (t) => {
    await assertTypeSnapshot(t, T.string)
  })

  await t.step("array", async (t) => {
    await assertTypeSnapshot(t, T.array(T.string))
  })

  await t.step("object", async (t) => {
    await assertTypeSnapshot(
      t,
      T.object({
        a: T.boolean,
        b: T.number,
        c: T.string,
      }),
    )
  })

  await t.step("option", async (t) => {
    await assertTypeSnapshot(t, T.option(T.string))
  })

  await t.step("enum", async (t) => {
    await assertTypeSnapshot(t, T.enum("A", "B", "C"))
  })

  await t.step("tagged union", async (t) => {
    await assertTypeSnapshot(
      t,
      T.taggedUnion("type", {
        A: T.boolean,
        B: T.number,
        C: T.string,
      }),
    )
  })
})

async function assertTypeSnapshot(t: Deno.TestContext, value: Type<any>): Promise<void> {
  await assertSnapshot(t, toSchema(value))
  const withContext = value`One.`
  await assertSnapshot(t, toSchema(withContext))
  await assertSnapshot(t, toSchema(withContext`Two.`))
}
