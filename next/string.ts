import { Type } from "./Type.ts"
import { assert } from "./util/assert.ts"

// TODO: why the need for the explicit return type of `atom`?
export const string = Type.declare<string, {
  minLength: number
  maxLength: number
}>(
  {
    assertRefinementsValid: ({ minLength, maxLength }) => {
      assert(
        typeof minLength === "number"
          && typeof maxLength === "number"
          && minLength <= maxLength,
      )
    },
    assert: (value) => assert(typeof value === "string"),
    transform: (value) => value,
    subschema: () => ({ type: "string" }),
    assertRefinements: {
      minLength: (value, minLength) => assert(value.length >= minLength),
      maxLength: (value, maxLength) => assert(value.length <= maxLength),
    },
  },
)
