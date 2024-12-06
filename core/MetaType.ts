import type { Type } from "./Type.ts"
import { deserializeType, type TypeInfo as TypeInfo_ } from "./TypeInfo.ts"
import * as T from "./types/mod.ts"
import { Record, Union } from "./utility/mod.ts"

const TypeInfo: Type<TypeInfo_, never> = T.taggedUnion("type", {
  boolean: T.object({
    description: T.string,
  }),
  number: T.object({
    description: T.string,
  }),
  string: T.object({
    description: T.string,
  }),
  array: T.object({
    description: T.string,
    element: T.deferred(() => TypeInfo),
  }),
  object: T.object({
    description: T.string,
    fields: Record(T.deferred(() => TypeInfo)),
  }),
  option: T.object({
    description: T.string,
    some: T.deferred(() => TypeInfo),
  }),
  enum: T.object({
    description: T.string,
    values: T.array(T.string),
  }),
  taggedUnion: T.object({
    description: T.string,
    tag: Union(T.number, T.string),
    members: Record(T.option(T.deferred(() => TypeInfo))),
  }),
})`A representation of a type definition.`

export const MetaType: Type<Type<unknown>> = T.transform("MetaType", TypeInfo, deserializeType)
