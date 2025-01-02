import * as I from "../intrinsics.ts"
import type { JSONType } from "../JSONSchema.ts"
import type { AnyType, Type } from "../Type.ts"
import { Hydrated } from "./Hydrated.ts"
import { Record } from "./Record.ts"
import { TaggedUnion } from "./TaggedUnion.ts"

const JSONType_: Type<JSONType> = I.f(
  "JSONType",
  TaggedUnion({
    null: null,
    boolean: null,
    integer: null,
    number: null,
    string: null,
    array: I.object({
      items: I.deferred((): AnyType => JSONType_),
    }),
    object: I.f(
      "JSONObjectType",
      Record(I.deferred((): AnyType => JSONType_)),
      (properties) => ({
        properties,
        required: Object.keys(properties),
        additionalProperties: false,
      }),
    ),
    union: I.object({
      anyOf: I.deferred(() => JSONType_),
    }),
  }),
  ({ type, value }) => ({
    ...type === "union" ? {} : { type },
    ...value ? value : {},
  }),
) as never

export type MetaType<P extends symbol = symbol> = Type<Type<unknown>, never, P>

export const MetaType: MetaType<never> = I.f(
  "MetaType",
  JSONType_,
  (jsonType) => Hydrated(jsonType),
)
