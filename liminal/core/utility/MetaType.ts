import * as L from "../intrinsics/mod.ts"
import type { JSONType } from "../JSONSchema.ts"
import type { AnyType, Type } from "../Type.ts"
import { Option } from "./Option.ts"
import { Record } from "./Record.ts"
import { TaggedUnion } from "./TaggedUnion.ts"

export type MetaType = Type<"union", JSONType, never>
export const MetaType: MetaType = L.union(...[
  L.object({
    type: L.enum("null", "boolean", "integer", "number"),
  }),
  L.object({
    type: L.const(L.string, "string"),
    enum: L.transform(Option(L.array(L.string)), (value) => value ? value : undefined),
  }),
  L.transform(
    TaggedUnion({
      array: L.object({
        items: L.ref((): AnyType => MetaType),
      }),
      object: L.transform(
        L.object({
          properties: Record(L.ref((): AnyType => MetaType)),
          additionalProperties: L.const(L.boolean, false),
        }),
        ({ properties, ...rest }) => ({
          properties,
          ...rest,
          required: Object.keys(properties),
        }),
      ),
    }),
    ({ type, value }) => ({ type, ...value }),
  ),
  L.object({
    anyOf: L.array(L.ref((): AnyType => MetaType)),
  }),
] as never)
