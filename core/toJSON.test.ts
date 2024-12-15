import { assertSnapshot } from "@std/testing/snapshot"
import { testIntrinsics } from "testing"
import { L } from "./mod.ts"
import { toJSON } from "./toJSON.ts"
import type { Type } from "./Type.ts"

testIntrinsics("toJSON", assertTypeSnapshot, {
  null: [
    [L.null],
  ],
  const: [
    [L.const(L.string, "Hello Liminal!")],
  ],
  boolean: [
    [L.boolean],
  ],
  number: [
    [L.number],
  ],
  integer: [
    [L.integer],
  ],
  string: [
    [L.string],
  ],
  array: [
    [L.array(L.string)],
  ],
  object: [
    [
      L.object({
        a: L.boolean,
        b: L.number,
        c: L.string,
      }),
    ],
  ],
  enum: [
    [L.enum("A", "B", "C")],
  ],
  union: [
    [L.union(L.null, L.string)],
  ],
  ref: [
    [L.ref(() => L.string)],
  ],
  transform: [
    [L.transform(L.string, (value) => ({ value }))],
  ],
})

async function assertTypeSnapshot(t: Deno.TestContext, value: Type<unknown, never>): Promise<void> {
  await assertSnapshot(t, toJSON(value))
  const withContext = value`One.`
  await assertSnapshot(t, toJSON(withContext))
  await assertSnapshot(t, toJSON(withContext`Two.`))
}
