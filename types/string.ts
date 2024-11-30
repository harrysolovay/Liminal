import { declare, type Type } from "../core/mod.ts"
import { assert } from "../util/assert.ts"

export const string: Type.Initial<string, {
  minLength: number
  maxLength: number
}> = declare({
  name: "string",
  source: {
    getType: () => string,
  },
  refinements: ({ minLength, maxLength }) => {
    assert(
      !(typeof minLength === "number" && typeof maxLength === "number") || minLength <= maxLength,
      "`minLength` cannot be greater than `maxLength`.",
    )
    return {
      minLength: `Length must be gte ${minLength} chars.`,
      maxLength: `Length must be lte ${maxLength} chars.`,
    }
  },
  subschema: () => ({ type: "string" }),
  output: (f) =>
    f({
      refinementPredicates: {
        minLength: (value, minLength) => value.length >= minLength,
        maxLength: (value, maxLength) => value.length <= maxLength,
      },
    }),
})
