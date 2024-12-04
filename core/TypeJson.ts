import type { Expand } from "../util/mod.ts"
import { Context } from "./Context.ts"
import { Type, typeKey } from "./Type.ts"
import * as T from "./types/mod.ts"

export type TypeJson = TypeJson.Make<{
  boolean: {}
  number: {}
  integer: {}
  string: {}
  array: {
    element: TypeJson
  }
  object: {
    fields: Record<string, TypeJson>
  }
  option: {
    some: TypeJson
  }
  enum: {
    values: Array<string>
  }
  taggedUnion: {
    tag: number | string
    members: Record<number | string, TypeJson | undefined>
  }
}>
namespace TypeJson {
  export type Make<L> = {
    [K in keyof L]: {
      type: K
      value: Expand<{ description: string } & L[K]>
    }
  }[keyof L]
}

export function fromJson(metadata: TypeJson): Type<unknown> {
  const base = (() => {
    switch (metadata.type) {
      case "boolean": {
        return T.boolean
      }
      case "number": {
        return T.number
      }
      case "integer": {
        return T.integer
      }
      case "string": {
        return T.string
      }
      case "array": {
        return T.array(fromJson(metadata.value.element))
      }
      case "object": {
        return T.object(
          Object.fromEntries(
            Object.entries(metadata.value.fields).map(([k, v]) => [k, fromJson(v)]),
          ),
        )
      }
      case "option": {
        return T.option(fromJson(metadata.value.some))
      }
      case "enum": {
        return T.enum(...metadata.value.values)
      }
      case "taggedUnion": {
        return T.taggedUnion(
          metadata.value.tag,
          Object.fromEntries(
            Object
              .entries(metadata.value.members)
              .map(([k, v]) => [k, v ? fromJson(v) : undefined]),
          ),
        )
      }
    }
  })()
  const { declaration, ctx } = base[typeKey]
  return Type(
    declaration,
    new Context(
      [metadata.value.description, ...ctx.descriptionParts],
      ctx.assertionConfigs,
      ctx.metadata,
    ),
  )
}
