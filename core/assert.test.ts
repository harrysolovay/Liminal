import * as A from "@std/assert"
import { testIntrinsics } from "testing"
import { L, type Type } from "../core/mod.ts"
import { assert } from "./assert.ts"

testIntrinsics<[Type<unknown, never>, unknown, errorCount?: number]>("assert", assertErrors, {
  null: [
    [L.null, null],
    [L.null, undefined, 1],
  ],
  boolean: [
    [L.boolean, true],
    [L.boolean, 20, 1],
  ],
  integer: [
    [L.integer, 1],
    [L.integer, 1.1, 1],
  ],
  number: [
    [L.number, 1],
    [L.number, 1.1],
    [L.number, "0", 1],
  ],
  string: [
    [L.string, "A"],
    [L.string, 1, 1],
  ],
  const: [
    [L.const(L.string, "A"), "A"],
    [L.const(L.string, "A"), "B", 1],
  ],
  enum: [
    [L.enum("A", "B"), "A"],
    [L.enum("A", "B"), "C", 1],
  ],
  array: [
    [L.array(L.number), [1, 2, 3]],
    [L.array(L.number), ["one", "two", "three"], 3],
  ],
  object: [
    [L.object({ a: L.string, b: L.number }), { a: "A", b: 2 }],
    [L.object({ a: L.string, b: L.number }), { a: "A" }, 1],
    [L.object({ a: L.string, b: L.number }), { a: "A", b: 2, c: true }, 1],
  ],
})

async function assertErrors(
  _t: Deno.TestContext,
  type: Type<unknown>,
  value: unknown,
  errorCount?: number,
): Promise<void> {
  try {
    await assert(type, value)
  } catch (exception: unknown) {
    A.assertInstanceOf(exception, AggregateError)
    A.assertEquals(exception.errors.length, errorCount ?? 0)
  }
}
