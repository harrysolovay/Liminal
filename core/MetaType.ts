import { Context } from "./Context.ts"
import { Type, typeKey } from "./Type.ts"
import { TypeMetadata } from "./TypeJson.ts"
import * as T from "./types.ts"

export const MetaType: Type<Type<unknown>> = T.transform("MetaType", TypeMetadata, hydrateType)

export function hydrateType(typeJson: TypeMetadata): Type<unknown> {
  const base = (() => {
    switch (typeJson.type) {
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
        return T.array(hydrateType(typeJson.value.element))
      }
      case "object": {
        return T.object(
          Object.fromEntries(
            Object.entries(typeJson.value.fields).map(([k, v]) => [k, hydrateType(v)]),
          ),
        )
      }
      case "option": {
        return T.option(hydrateType(typeJson.value.some))
      }
      case "enum": {
        return T.enum(...typeJson.value.values)
      }
      case "taggedUnion": {
        return T.taggedUnion(
          typeJson.value.tag,
          Object.fromEntries(
            Object
              .entries(typeJson.value.members)
              .map(([k, v]) => [k, v ? hydrateType(v) : undefined]),
          ),
        )
      }
    }
  })()
  const { declaration, ctx } = base[typeKey]
  return Type(
    declaration,
    new Context([typeJson.value.description, ...ctx.parts], ctx.assertions, ctx.metadata),
  )
}
