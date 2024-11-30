import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"
import { assert } from "../util/assert.ts"

export function array<E extends Type>(element: E): Type<Array<E["T"]>, {
  minLength: number
  maxLength: number
  contains: unknown[]
}, E["P"]> {
  return declare({
    name: "array",
    source: {
      factory: array,
      args: { element },
    },
    subschema: (visit) => ({
      type: "array",
      items: visit(element),
    }),
    refinements: ({ minLength, maxLength, contains }) => {
      assert(
        !(typeof minLength === "number" && typeof maxLength === "number") || minLength <= maxLength,
        "`minLength` cannot be greater than `maxLength`.",
      )
      if (contains) {
        assert(
          typeof minLength !== "number" || contains.length >= minLength,
          "`contains` length cannot be less than `minLength`",
        )
        assert(
          typeof maxLength !== "number" || contains.length >= maxLength,
          "`contains` length cannot be greater than `maxLength`",
        )
      }
      return {
        minLength: `Length must be gte ${minLength} elements.`,
        maxLength: `Length must be lte ${maxLength} elements.`,
      }
    },
    output: (f) =>
      f<Array<E["T"]>>({
        visitor: (value, visit, ctx) =>
          value.map((v, i) => visit(v, element, ctx.descend(i, "number"))),
        refinementPredicates: {
          minLength: (value, minLength) => value.length >= minLength,
          maxLength: (value, maxLength) => value.length <= maxLength,
        },
      }),
  })
}
