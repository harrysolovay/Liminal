import { declare, type Type } from "../core/mod.ts"
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
  refinements: ({ min, max }) => {
    assert(
      !(typeof min === "number" && typeof max === "number") || min <= max,
      "`min` cannot be greater than `max`.",
    )
    return {
      min: `Must be gte ${min}.`,
      max: `Must be lte ${max}.`,
    }
  },
  subschema: (_0, ctx) => ({
    type: ctx.refinements.int ? "integer" : "number",
  }),
  output: (f) =>
    f<number>({
      refinementPredicates: {
        min: (value, min) => value >= min,
        max: (value, max) => value <= max,
      },
    }),
})
