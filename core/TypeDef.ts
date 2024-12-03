import { Record, Union } from "./derived/mod.ts"
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

export type TypeDef =
  | { type: "boolean" }
  | { type: "number" }
  | { type: "string" }
  | {
    type: "array"
    value: TypeDef
  }
  | {
    type: "object"
    value: Record<number | string, TypeDef>
  }
  | {
    type: "option"
    value: TypeDef
  }
  | {
    type: "enum"
    value: Array<string>
  }
  | {
    type: "taggedUnion"
    value: {
      tag: number | string
      members: Record<number | string, TypeDef | undefined>
    }
  }

export const TypeDef: Type<TypeDef, never> = taggedUnion("type", {
  boolean: undefined,
  number: undefined,
  string: undefined,
  array: deferred(() => TypeDef),
  object: Record(deferred(() => TypeDef)),
  option: deferred(() => TypeDef),
  enum: array(string),
  taggedUnion: object({
    tag: Union(number, string),
    members: Record(option(deferred(() => TypeDef))),
  }),
})`Type def.`

export function hydrateType(def: TypeDef): Type<unknown> {
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
      return array(hydrateType(def.value))
    }
    case "object": {
      return object(
        Object.fromEntries(Object.entries(def.value).map(([k, v]) => [k, hydrateType(v)])),
      )
    }
    case "option": {
      return option(hydrateType(def.value))
    }
    case "enum": {
      return enum_(...def.value)
    }
    case "taggedUnion": {
      return taggedUnion(
        def.value.tag,
        Object.fromEntries(
          Object.entries(def.value.members).map(([k, v]) => [k, v ? hydrateType(v) : undefined]),
        ),
      )
    }
  }
}
