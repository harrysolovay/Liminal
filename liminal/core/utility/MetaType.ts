import {
  array,
  boolean,
  const as const_,
  enum as enum_,
  object,
  ref,
  string,
  transform,
  union,
} from "../intrinsics/mod.ts"
import type { JSONType } from "../JSONSchema.ts"
import type { AnyType, Type } from "../Type.ts"
import { Option } from "./Option.ts"
import { Record } from "./Record.ts"
import { TaggedUnion } from "./TaggedUnion.ts"

export type MetaType = Type<"union", JSONType, never>
export const MetaType: MetaType = union(...[
  object({
    type: enum_("null", "boolean", "integer", "number"),
  }),
  object({
    type: const_(string, "string"),
    enum: transform(Option(array(string)), (value) => value ? value : undefined),
  }),
  transform(
    TaggedUnion({
      array: object({
        items: ref((): AnyType => MetaType),
      }),
      object: transform(
        object({
          properties: Record(ref((): AnyType => MetaType)),
          additionalProperties: const_(boolean, false),
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
  object({
    anyOf: array(ref((): AnyType => MetaType)),
  }),
] as never)
