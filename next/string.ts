import { Type } from "./Type.ts"
import { TypeMetadata } from "./TypeMetadata.ts"
import { assert } from "./util/assert.ts"

class M extends TypeMetadata.make("string", false)<string, {
  minLength: number
  maxLength: number
}> {}

// TODO: why the need for the explicit return type of `atom`?
export const string = Type.declare<M, string>(
  new M({ atom: (): Type => string }),
  {
    assert: (value) => assert(typeof value === "string"),
    transform: (value) => value,
    subschema: () => ({ type: "string" }),
    validateRefinements: ({ minLength, maxLength }) => {
      if (typeof minLength === "number" && typeof maxLength === "number") {
        assert(minLength <= maxLength)
      }
    },
    refinements: {
      minLength: (value, minLength) => assert(value.length >= minLength),
      maxLength: (value, maxLength) => assert(value.length <= maxLength),
    },
  },
)
