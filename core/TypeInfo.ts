import type { Expand } from "../util/mod.ts"
import { Context } from "./Context.ts"
import { Type } from "./Type.ts"
import * as T from "./types/mod.ts"

export type TypeInfo = TypeInfo.Make<{
  boolean: {}
  number: {}
  integer: {}
  string: {}
  array: {
    element: TypeInfo
  }
  object: {
    fields: Record<string, TypeInfo>
  }
  option: {
    some: TypeInfo
  }
  enum: {
    values: Array<string>
  }
  taggedUnion: {
    tag: number | string
    members: Record<number | string, TypeInfo | undefined>
  }
}>
namespace TypeInfo {
  export type Make<L> = {
    [K in keyof L]: {
      type: K
      value: Expand<{ description: string } & L[K]>
    }
  }[keyof L]
}

export function deserializeType(into: TypeInfo): Type<unknown> {
  const base = (() => {
    switch (into.type) {
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
        return T.array(deserializeType(into.value.element))
      }
      case "object": {
        return T.object(
          Object.fromEntries(
            Object.entries(into.value.fields).map(([k, v]) => [k, deserializeType(v)]),
          ),
        )
      }
      case "option": {
        return T.option(deserializeType(into.value.some))
      }
      case "enum": {
        return T.enum(...into.value.values)
      }
      case "taggedUnion": {
        return T.taggedUnion(
          into.value.tag,
          Object.fromEntries(
            Object
              .entries(into.value.members)
              .map(([k, v]) => [k, v ? deserializeType(v) : undefined]),
          ),
        )
      }
    }
  })()
  const { declaration, ctx } = base
  return Type(
    declaration,
    new Context(
      [into.value.description, ...ctx.descriptionParts],
      ctx.assertionConfigs,
      ctx.metadata,
    ),
  )
}
