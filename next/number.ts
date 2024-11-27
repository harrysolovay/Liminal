import { Type } from "./Type.ts"
import { assert } from "./util/assert.ts"

export const number = Type.declare<number, {
  min: number
  max: number
}>({
  assertRefinementsValid: ({ min, max }) => {
    assert(
      typeof min === "number"
        && typeof max === "number"
        && min <= max,
    )
  },
  subschema: () => ({ type: "number" }),
  assert: (value) => assert(typeof value === "number"),
  transform: (value) => value,
  assertRefinements: {
    min: (value, min) => assert(value >= min),
    max: (value, max) => assert(value <= max),
  },
})
