import { assertSnapshot } from "@std/testing/snapshot"
import { T, type Type } from "../mod.ts"
import { toJsonSchema } from "./toJsonSchema.ts"

Deno.test("boolean", async (t) => {
  await assertTypeSnapshot(t, T.boolean)
})

Deno.test("number", async (t) => {
  await assertTypeSnapshot(t, T.number)
})

Deno.test("string", async (t) => {
  await assertTypeSnapshot(t, T.string)
})

Deno.test("array", async (t) => {
  await assertTypeSnapshot(t, T.array(T.string))
})

Deno.test("object", async (t) => {
  await assertTypeSnapshot(
    t,
    T.object({
      a: T.boolean,
      b: T.number,
      c: T.string,
    }),
  )
})

Deno.test("option", async (t) => {
  await assertTypeSnapshot(t, T.option(T.string))
})

Deno.test("enum", async (t) => {
  await assertTypeSnapshot(t, T.enum("A", "B", "C"))
})

Deno.test("tagged union", async (t) => {
  await assertTypeSnapshot(
    t,
    T.taggedUnion("type", {
      A: T.boolean,
      B: T.number,
      C: T.string,
    }),
  )
})

async function assertTypeSnapshot(t: Deno.TestContext, value: Type<any>): Promise<void> {
  await assertSnapshot(t, toJsonSchema(value))
  const withContext = value`One.`
  await assertSnapshot(t, toJsonSchema(withContext))
  await assertSnapshot(t, toJsonSchema(withContext`Two.`))
}
