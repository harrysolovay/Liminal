import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"
import { assert } from "../util/assert.ts"

export const number: Type.Initial<number, {
  min: number
  max: number
  int: boolean
}> = declare<number>()({
  name: "number",
  source: {
    getType: () => number,
  },
  subschema: (_0, ctx) => ({
    type: ctx.refinements.int ? "integer" : "number",
  }),
  assertRefinementsValid: ({ min, max }) =>
    assert(
      !(typeof min === "number" && typeof max === "number") || min <= max,
      "Refinement min is greater than its max.",
    ),
  assertRefinements: {
    min: (value, min) => assert(value >= min, `value >= ${min}`),
    max: (value, max) => assert(value <= max, `value <= ${max}`),
  },
})
