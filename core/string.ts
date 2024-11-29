import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"
import { assert } from "../util/assert.ts"

export const string: Type.Initial<string, {
  minLength: number
  maxLength: number
}> = declare({
  name: "string",
  source: {
    getType: () => string,
  },
  assertRefinementsValid: ({ minLength, maxLength }) => {
    assert(
      !(typeof minLength === "number" && typeof maxLength === "number") || minLength <= maxLength,
    )
  },
  subschema: () => ({ type: "string" }),
  output: (f) =>
    f({
      asserts: {
        minLength: (value, minLength) => assert(value.length >= minLength),
        maxLength: (value, maxLength) => assert(value.length <= maxLength),
      },
    }),
})
