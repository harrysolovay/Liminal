import type { Expand } from "../util/mod.ts"
import { Record, Union } from "./derived/mod.ts"
import { described } from "./described.ts"
import type { Type } from "./Type.ts"
import {
  array,
  boolean,
  deferred,
  enum as enum_,
  number,
  object,
  option,
  string,
  taggedUnion,
} from "./types.ts"

export type TypeDef = {
  [K in keyof TypeDef.Metadata]: {
    type: K
    value: Expand<
      & { description: string }
      & ([TypeDef.Metadata[K]] extends [never] ? {} : TypeDef.Metadata[K])
    >
  }
}[keyof TypeDef.Metadata]
namespace TypeDef {
  export type Metadata = {
    boolean: never
    number: never
    string: never
    array: {
      element: TypeDef
    }
    object: {
      fields: Record<number | string, TypeDef>
    }
    option: {
      Some: TypeDef
    }
    enum: {
      values: Array<string>
    }
    taggedUnion: {
      tag: number | string
      members: Record<number | string, TypeDef | undefined>
    }
  }
}

export const TypeDef: Type<TypeDef, never> = taggedUnion("type", {
  boolean: object({
    description: string,
  }),
  number: object({
    description: string,
  }),
  string: object({
    description: string,
  }),
  array: object({
    description: string,
    element: deferred(() => TypeDef),
  }),
  object: object({
    description: string,
    fields: Record(deferred(() => TypeDef)),
  }),
  option: object({
    description: string,
    Some: deferred(() => TypeDef),
  }),
  enum: object({
    description: string,
    values: array(string),
  }),
  taggedUnion: object({
    description: string,
    tag: Union(number, string),
    members: Record(option(deferred(() => TypeDef))),
  }),
})`Type def.`

export function hydrateType(def: TypeDef): Type<unknown> {
  return described(
    (() => {
      switch (def.type) {
        case "boolean": {
          return boolean
        }
        case "number": {
          return number
        }
        case "string": {
          return string
        }
        case "array": {
          return array(hydrateType(def.value.element))
        }
        case "object": {
          return object(
            Object.fromEntries(
              Object.entries(def.value.fields).map(([k, v]) => [k, hydrateType(v)]),
            ),
          )
        }
        case "option": {
          return option(hydrateType(def.value.Some))
        }
        case "enum": {
          return enum_(...def.value.values)
        }
        case "taggedUnion": {
          return taggedUnion(
            def.value.tag,
            Object.fromEntries(
              Object
                .entries(def.value.members)
                .map(([k, v]) => [k, v ? hydrateType(v) : undefined]),
            ),
          )
        }
      }
    })(),
    def.value.description,
  )
}
