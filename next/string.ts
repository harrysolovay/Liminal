import { assert } from "@std/assert"
import { declare, type Type } from "./Type.ts"
import { TypeMetadata } from "./TypeMetadata.ts"

class M extends TypeMetadata.make("string", false)<string, {
  minLength: number
  maxLength: number
}> {}

export const string = declare<M, string>(
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
