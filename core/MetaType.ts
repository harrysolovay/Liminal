import type { Type } from "./Type.ts"
import { hydrateType, type TypeJson as TypeJson_ } from "./TypeJson.ts"
import * as T from "./types/mod.ts"
import { Record, Union } from "./utility/mod.ts"

const TypeJson: Type<TypeJson_, never> = T.taggedUnion("type", {
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
    element: T.deferred(() => TypeJson),
  }),
  object: T.object({
    description: T.string,
    fields: Record(T.deferred(() => TypeJson)),
  }),
  option: T.object({
    description: T.string,
    some: T.deferred(() => TypeJson),
  }),
  enum: T.object({
    description: T.string,
    values: T.array(T.string),
  }),
  taggedUnion: T.object({
    description: T.string,
    tag: Union(T.number, T.string),
    members: Record(T.option(T.deferred(() => TypeJson))),
  }),
})`A representation of a type definition.`

export const MetaType: Type<Type<unknown>> = T.transform("MetaType", TypeJson, hydrateType)
