import { L, type PartialType, type Type } from "../core/mod.ts"
import { Hydrated } from "./Hydrated.ts"
import type { JSONType } from "./JSONSchema.ts"

const JSONType_: Type<JSONType> = L.transform(
  L.TaggedUnion({
    null: null,
    boolean: null,
    integer: null,
    number: null,
    string: null,
    array: L.object({
      items: L.ref((): PartialType => JSONType_),
    }),
    object: L.transform(L.Record(L.ref((): PartialType => JSONType_)), (properties) => ({
      properties,
      required: Object.keys(properties),
      additionalProperties: false,
    })),
    union: L.object({
      anyOf: L.ref(() => JSONType_),
    }),
  }),
  ({ type, value }) => ({
    ...type === "union" ? {} : { type },
    ...value ? value : {},
  }),
) as never

export type MetaType<P extends symbol> = Type<Type<unknown>, P>

export const MetaType: MetaType<never> = L.transform(JSONType_, Hydrated)
