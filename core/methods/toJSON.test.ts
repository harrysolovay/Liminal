import { assertSnapshot } from "@std/testing/snapshot"
import { testIntrinsics } from "testing"
import * as I from "../intrinsics.ts"
import type { Type } from "../Type.ts"

testIntrinsics("toJSON", assertTypeSnapshot, {
  null: [
    [I.null],
  ],
  const: [
    [I.const(I.string, "Hello Liminal!")],
  ],
  boolean: [
    [I.boolean],
  ],
  number: [
    [I.number],
  ],
  integer: [
    [I.integer],
  ],
  string: [
    [I.string],
  ],
  array: [
    [I.array(I.string)],
  ],
  object: [
    [
      I.object({
        a: I.boolean,
        b: I.number,
        c: I.string,
      }),
    ],
  ],
  enum: [
    [I.enum("A", "B", "C")],
  ],
  union: [
    [I.union(I.null, I.string)],
  ],
  ref: [
    [I.ref(() => I.string)],
  ],
  transform: [
    [I.transform(I.string, (value) => ({ value }))],
  ],
})

async function assertTypeSnapshot(t: Deno.TestContext, type: Type<unknown>): Promise<void> {
  await assertSnapshot(t, type.toJSON())
  const withContext = type`One.`
  await assertSnapshot(t, withContext.toJSON())
  await assertSnapshot(t, withContext`Two.`.toJSON())
}
