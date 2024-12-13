import { assert } from "@std/assert"
import { declare } from "../declare.ts"
import type { Type } from "../Type.ts"

export { null_ as null }
const null_: Type<null, never> = declare("null", {
  getAtom: () => null_,
  assert: (value) => {
    assert(value === null)
  },
})

export const boolean: Type<boolean, never> = declare("boolean", {
  getAtom: () => boolean,
  assert: (value) => {
    assert(typeof value === "boolean")
  },
})

export const integer: Type<number, never> = declare("integer", {
  getAtom: () => integer,
  assert: (value) => {
    assert(Number.isInteger(value))
  },
})

export const number: Type<number, never> = declare("number", {
  getAtom: () => number,
  assert: (value) => {
    assert(typeof value === "number")
  },
})

export const string: Type<string, never> = declare("string", {
  getAtom: () => string,
  assert: (value) => {
    assert(typeof value === "string")
  },
})
