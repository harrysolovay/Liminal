import { type Refiners, Type } from "./Type.ts"
import { assert } from "./util/assert.ts"

export const number: Type<
  number,
  Refiners<{
    min: number
    max: number
  }>,
  never
> = Type.declare({
  name: "number",
  source: {
    getType: (): Type => number,
  },
  subschema: () => ({ type: "number" }),
  assert: (value) => assert(typeof value === "number"),
  transform: (value) => value,
  assertRefinementsValid: ({ min, max }) => {
    assert(typeof min === "number" && typeof max === "number" && min <= max)
  },
  assertRefinements: {
    min: (value, min) => assert(value >= min),
    max: (value, max) => assert(value <= max),
  },
})
