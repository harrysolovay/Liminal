import { nullToUndefined } from "../../util/mod.ts"
import * as I from "../intrinsics/mod.ts"
import type { JSONType, JSONTypeName, JSONTypes } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"
import { Option } from "./Option.ts"
import { Record } from "./Record.ts"
import { Tagged } from "./Tagged.ts"

export const NullMetaType: Base<"null"> = Tagged("type", "null")

export const BooleanMetaType: Base<"boolean"> = Tagged("type", "boolean")

export const IntegerMetaType: Base<"integer"> = Tagged("type", "integer")

export const NumberMetaType: Base<"number"> = Tagged("type", "number")

export const StringMetaType: Base<"string"> = Tagged("type", "string", {
  enum: I.transform(Option(I.array(I.string)), nullToUndefined),
})

export const ArrayMetaType: Base<"array"> = Tagged("type", "array", {
  items: I.ref((): MetaType => MetaType),
})

export const ObjectMetaType: Base<"object"> = I.transform(
  Tagged("type", "object", {
    properties: Record(I.ref((): MetaType => MetaType)),
    additionalProperties: I.const(I.boolean, false),
  }),
  ({ properties, ...rest }) => ({
    properties,
    ...rest,
    required: Object.keys(properties),
  }),
)

export const UnionMetaType: Base<"union"> = I.object({
  anyOf: I.array(I.ref(() => MetaType)),
})

export type MetaType = typeof MetaType
export const MetaType: Type<JSONType, never> = I.union(
  NullMetaType,
  BooleanMetaType,
  IntegerMetaType,
  NumberMetaType,
  StringMetaType,
  ArrayMetaType,
  ObjectMetaType,
)

type Base<K extends JSONTypeName = JSONTypeName> = [Type<JSONTypes[K], never>][0]
