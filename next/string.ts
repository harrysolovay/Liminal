import { type Refiners, Type } from "./Type.ts"
import { assert } from "./util/assert.ts"

export const string: Type<
  string,
  Refiners<{
    minLength: number
    maxLength: number
  }>,
  never
> = Type.declare(
  {
    name: "string",
    source: {
      getType: (): Type => string,
    },
    subschema: () => ({ type: "string" }),
    *assert(value, ctx) {
      const x = yield* ctx.assertExists(value)
      const y = yield* ctx.assertString(x)
    },
    transform: (value) => value,
    assertRefinementsValid: ({ minLength, maxLength }) => {
      assert(
        typeof minLength === "number" && typeof maxLength === "number" && minLength <= maxLength,
      )
    },
    assertRefinements: {
      minLength: (value, minLength) => assert(value.length >= minLength),
      maxLength: (value, maxLength) => assert(value.length <= maxLength),
    },
  },
)
