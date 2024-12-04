import type { Expand } from "../../util/type_util.ts"
import type { Type } from "../Type.ts"
import * as T from "../types/mod.ts"
import { Record, Union } from "./mod.ts"

export const TypeMetadata: Type<TypeMetadata, never> = T.taggedUnion("type", {
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
    element: T.deferred(() => TypeMetadata),
  }),
  object: T.object({
    description: T.string,
    fields: Record(T.deferred(() => TypeMetadata)),
  }),
  option: T.object({
    description: T.string,
    some: T.deferred(() => TypeMetadata),
  }),
  enum: T.object({
    description: T.string,
    values: T.array(T.string),
  }),
  taggedUnion: T.object({
    description: T.string,
    tag: Union(T.number, T.string),
    members: Record(T.option(T.deferred(() => TypeMetadata))),
  }),
})`Type Definition.`

export type TypeMetadata = MakeTypeMetadata<{
  boolean: {}
  number: {}
  integer: {}
  string: {}
  array: {
    element: TypeMetadata
  }
  object: {
    fields: Record<string, TypeMetadata>
  }
  option: {
    some: TypeMetadata
  }
  enum: {
    values: Array<string>
  }
  taggedUnion: {
    tag: number | string
    members: Record<number | string, TypeMetadata | undefined>
  }
}>

type MakeTypeMetadata<L> = {
  [K in keyof L]: {
    type: K
    value: Expand<{ description: string } & L[K]>
  }
}[keyof L]
