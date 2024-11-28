import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"
import { assert } from "../util/assert.ts"

export function array<E extends Type>(element: E): Type<Array<E["T"]>, {
  minLength: number
  maxLength: number
}, E["P"]> {
  return declare<Array<E["T"]>>()({
    name: "array",
    source: {
      factory: array,
      args: { element },
    },
    subschema: (ref) => ({
      type: "array",
      items: ref(element),
    }),
    visitor: (value, visit) => value.map((v, i) => visit(v, element, i)),
    assertRefinementsValid: ({ minLength, maxLength }) => {
      assert(
        !(typeof minLength === "number" && typeof maxLength === "number") || minLength <= maxLength,
      )
    },
    assertRefinements: {
      minLength: (value, minLength) => value.length >= minLength,
      maxLength: (value, maxLength) => value.length <= maxLength,
    },
  })
}
