import { assert } from "../../util/assert.ts"
import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"

export const number: Type.Initial<number, {
  min: number
  max: number
}> = declare<number>()({
  name: "number",
  source: {
    getType: () => number,
  },
  subschema: () => ({ type: "number" }),
  transform: (value) => value,
  assertRefinementsValid: ({ min, max }) => {
    assert(!(typeof min === "number" && typeof max === "number") || min <= max)
  },
  assertRefinements: {
    min: (value, min) => assert(value >= min),
    max: (value, max) => assert(value <= max),
  },
})
