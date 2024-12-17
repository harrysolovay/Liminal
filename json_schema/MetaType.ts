import * as I from "../core/intrinsics/mod.ts"
import type { AnyType, Type } from "../core/Type.ts"
import { Record, TaggedUnion } from "../core/utility/mod.ts"
import { Hydrated } from "./Hydrated.ts"
import type { JSONType } from "./JSONSchema.ts"

const JSONType_: Type<JSONType> = I.transform(
  TaggedUnion({
    null: null,
    boolean: null,
    integer: null,
    number: null,
    string: null,
    array: I.object({
      items: I.ref((): AnyType => JSONType_),
    }),
    object: I.transform(Record(I.ref((): AnyType => JSONType_)), (properties) => ({
      properties,
      required: Object.keys(properties),
      additionalProperties: false,
    })),
    union: I.object({
      anyOf: I.ref(() => JSONType_),
    }),
  }),
  ({ type, value }) => ({
    ...type === "union" ? {} : { type },
    ...value ? value : {},
  }),
) as never

export type MetaType<P extends symbol> = Type<Type<unknown>, P>

export const MetaType: MetaType<never> = I.transform(JSONType_, Hydrated)
