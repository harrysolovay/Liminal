import { assert } from "@std/assert"
import type { Type } from "../Type.ts"
import { declare } from "./declare.ts"

export { null_ as null }
const null_: Type<null> = declare({
  getAtom: () => null_,
  assert: (value) => {
    assert(value === null)
  },
})

export const boolean: Type<boolean> = declare({
  getAtom: () => boolean,
  assert: (value) => {
    assert(typeof value === "boolean")
  },
})

export const integer: Type<number> = declare({
  getAtom: () => integer,
  assert: (value) => {
    assert(Number.isInteger(value))
  },
})

export const number: Type<number> = declare({
  getAtom: () => number,
  assert: (value) => {
    assert(typeof value === "number")
  },
})

export const string: Type<string> = declare({
  getAtom: () => string,
  assert: (value) => {
    assert(typeof value === "string")
  },
})
