import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"
import { assert } from "../util/assert.ts"

export const number: Type.Initial<number, {
  min: number
  max: number
}> = declare<number>()({
  name: "number",
  source: {
    getType: () => number,
  },
  subschema: () => ({ type: "number" }),
  visitor: (value) => value,
  assertRefinementsValid: ({ min, max }) => {
    assert(
      !(typeof min === "number" && typeof max === "number") || min <= max,
      "Refinement min is greater than its max.",
    )
  },
  assertRefinements: {
    min: (value, min) =>
      assert(
        value >= min,
        `Received value of ${value}, which defies refinement (value >= ${min}).`,
      ),
    max: (value, max) =>
      assert(value <= max, `Received value ${value}, which defies refinement (value <= ${max}).`),
  },
})
