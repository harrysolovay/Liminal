import { Type } from "./Type.ts"
import { TypeMetadata } from "./TypeMetadata.ts"
import { assert } from "./util/assert.ts"

class M extends TypeMetadata.make("number", false)<number, {
  min: number
  max: number
}> {}

// TODO: why the need for the explicit return type of `atom`?
export const number = Type.declare<M, number>(
  new M({ atom: (): Type => number }),
  {
    assert: (value) => assert(typeof value === "string"),
    transform: (value) => value,
    subschema: () => ({ type: "string" }),
    validateRefinements: ({ min, max }) => {
      if (typeof min === "number" && typeof max === "number") {
        assert(min <= max)
      }
    },
    refinements: {
      min: (value, min) => assert(value >= min),
      max: (value, max) => assert(value <= max),
    },
  },
)
