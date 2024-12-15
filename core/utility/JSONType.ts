import * as I from "../intrinsics/mod.ts"
import type { JSONType as JSONType_ } from "../JSONSchema.ts"
import type { AnyType, Type } from "../Type.ts"
import { Record } from "./Record.ts"
import { TaggedUnion } from "./TaggedUnion.ts"

export const JSONType: Type<JSONType_, never> = I.union(
  I.transform(
    TaggedUnion("type", {
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
    }),
    ({ type, value }) => ({ type, ...value }),
  ),
  I.ref(() => JSONType),
) as never

// `Prefer complex variants / represent a comprehensive data type, containing many subtypes.`
