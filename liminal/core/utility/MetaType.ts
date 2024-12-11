import * as I from "../intrinsics/mod.ts"
import type { JSONType } from "../JSONSchema.ts"
import type { AnyType, Type } from "../Type.ts"
import { Option } from "./Option.ts"
import { Record } from "./Record.ts"
import { TaggedUnion } from "./TaggedUnion.ts"

export type MetaType = Type<"union", JSONType, never>
export const MetaType: MetaType = I.union(...[
  I.object({
    type: I.enum("null", "boolean", "integer", "number"),
  }),
  I.object({
    type: I.const(I.string, "string"),
    enum: I.transform(Option(I.array(I.string)), (value) => value ? value : undefined),
  }),
  I.transform(
    TaggedUnion({
      array: I.object({
        items: I.ref((): AnyType => MetaType),
      }),
      object: I.transform(
        I.object({
          properties: Record(I.ref((): AnyType => MetaType)),
          additionalProperties: I.const(I.boolean, false),
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
  I.object({
    anyOf: I.array(I.ref((): AnyType => MetaType)),
  }),
] as never)
