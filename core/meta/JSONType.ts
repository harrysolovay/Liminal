import * as I from "../intrinsics/mod.ts"
import type { JSONType as JSONType_ } from "../JSONSchema.ts"
import type { AnyType, Type } from "../Type.ts"
import { Record, TaggedUnion } from "../utility/mod.ts"

export const JSONType: Type<JSONType_, never> = I.transform(
  TaggedUnion({
    null: null,
    boolean: null,
    integer: null,
    number: null,
    string: null,
    array: I.object({
      items: I.ref((): AnyType => JSONType),
    }),
    object: I.transform(Record(I.ref((): AnyType => JSONType)), (properties) => ({
      properties,
      required: Object.keys(properties),
      additionalProperties: false,
    })),
    union: I.object({
      anyOf: I.ref(() => JSONType),
    }),
  }),
  ({ type, value }) => ({
    ...type === "union" ? {} : { type },
    ...value ? value : {},
  }),
) as never
