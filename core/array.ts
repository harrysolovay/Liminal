import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"
import { assert } from "../util/assert.ts"

export function array<E extends Type>(element: E): Type<Array<E["T"]>, {
  minLength: number
  maxLength: number
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
    assertRefinementsValid: ({ minLength, maxLength }) => {
      assert(
        !(typeof minLength === "number" && typeof maxLength === "number") || minLength <= maxLength,
      )
    },
    output: (f) =>
      f<Array<E["T"]>>({
        visitor: (value, visit, path) =>
          value.map((v, i) => visit(v, element, path.type("number").value(i))),
        asserts: {
          minLength: (value, minLength) => value.length >= minLength,
          maxLength: (value, maxLength) => value.length <= maxLength,
        },
      }),
  })
}
