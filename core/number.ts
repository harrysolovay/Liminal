import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"
import { assert } from "../util/assert.ts"

export const number: Type.Initial<number, {
  min: number
  max: number
  int: boolean
}> = declare({
  name: "number",
  source: {
    getType: () => number,
  },
  assertRefinementsValid: ({ min, max }) =>
    assert(
      !(typeof min === "number" && typeof max === "number") || min <= max,
      "Refinement min is greater than its max.",
    ),
  subschema: (_0, ctx) => ({
    type: ctx.refinements.int ? "integer" : "number",
  }),
  output: (f) =>
    f<number>({
      asserts: {
        min: (value, min) => assert(value >= min, `value >= ${min}`),
        max: (value, max) => assert(value <= max, `value <= ${max}`),
      },
    }),
})
