import { assert } from "@std/assert"
import { declare } from "../declare.ts"
import type { Type } from "../Type.ts"

export { null_ as null }
const null_: Type<null, never> = declare({
  getAtom: () => null_,
  assert: (value) => {
    assert(value === null)
  },
})

export const boolean: Type<boolean, never> = declare({
  getAtom: () => boolean,
  assert: (value) => {
    assert(typeof value === "boolean")
  },
})

export const integer: Type<number, never> = declare({
  getAtom: () => integer,
  assert: (value) => {
    assert(Number.isInteger(value))
  },
})

export const number: Type<number, never> = declare({
  getAtom: () => number,
  assert: (value) => {
    assert(typeof value === "number")
  },
})

export const string: Type<string, never> = declare({
  getAtom: () => string,
  assert: (value) => {
    assert(typeof value === "string")
  },
})
