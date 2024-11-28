import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"
import { assert } from "../util/assert.ts"

export const string: Type.Initial<string, {
  minLength: number
  maxLength: number
}> = declare<string>()({
  name: "string",
  source: {
    getType: () => string,
  },
  subschema: () => ({ type: "string" }),
  visitor: (value) => value,
  assertRefinementsValid: ({ minLength, maxLength }) => {
    assert(
      !(typeof minLength === "number" && typeof maxLength === "number") || minLength <= maxLength,
    )
  },
  assertRefinements: {
    minLength: (value, minLength) => assert(value.length >= minLength),
    maxLength: (value, maxLength) => assert(value.length <= maxLength),
  },
})
