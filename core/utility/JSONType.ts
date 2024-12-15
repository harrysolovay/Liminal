import { nullToUndefined } from "../../util/mod.ts"
import * as I from "../intrinsics/mod.ts"
import type { JSONType as JSONType_, JSONTypeName, JSONTypes } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"
import { Option } from "./Option.ts"
import { Record } from "./Record.ts"
import { Tagged } from "./Tagged.ts"

export const NullJSONType: Base<"null"> = Tagged("type", "null")

export const BooleanJSONType: Base<"boolean"> = Tagged("type", "boolean")

export const IntegerJSONType: Base<"integer"> = Tagged("type", "integer")

export const NumberJSONType: Base<"number"> = Tagged("type", "number")

export const StringJSONType: Base<"string"> = Tagged("type", "string", {
  enum: I.transform(Option(I.array(I.string)), nullToUndefined),
})

export const ArrayJSONType: Base<"array"> = Tagged("type", "array", {
  items: I.ref((): JSONType => JSONType),
})

export const ObjectJSONType: Base<"object"> = I.transform(
  Tagged("type", "object", {
    properties: Record(I.ref((): JSONType => JSONType)),
    additionalProperties: I.const(I.boolean, false),
  }),
  ({ properties, ...rest }) => ({
    properties,
    ...rest,
    required: Object.keys(properties),
  }),
)

export const UnionJSONType: Base<"union"> = I.object({
  anyOf: I.array(I.ref(() => JSONType)),
})

export type JSONType = typeof JSONType
export const JSONType: Type<JSONType_, never> = I.union(
  NullJSONType,
  BooleanJSONType,
  IntegerJSONType,
  NumberJSONType,
  StringJSONType,
  ArrayJSONType,
  ObjectJSONType,
)

type Base<K extends JSONTypeName = JSONTypeName> = [Type<JSONTypes[K], never>][0]
