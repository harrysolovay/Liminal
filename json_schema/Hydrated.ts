import { L, type Type } from "../core/mod.ts"
import type { JSONType } from "./JSONSchema.ts"

export function Hydrated(type: JSONType): Type<unknown> {
  const types: Record<string, undefined | Type<unknown>> = {}
  return visit(type) as never

  function visit(type: JSONType) {
    const initial = ((): Type<unknown> => {
      if ("$defs" in type && type.$defs) {
        Object.entries(type.$defs).forEach(([id, jsonType]) => {
          if (!(id in types)) {
            types[id] = undefined
            types[id] = visit(jsonType)
          }
        })
      }
      if ("$ref" in type) {
        const id = type.$ref.split("#/$defs/").pop()!
        return L.ref(() => types[id]!)
      } else if ("anyOf" in type) {
        return L.union(...type.anyOf.map(visit))
      }
      switch (type.type) {
        case "null": {
          return L.null
        }
        case "boolean": {
          return L.boolean
        }
        case "integer": {
          return L.integer
        }
        case "number": {
          return L.number
        }
        case "string": {
          return type.enum ? L.enum(...type.enum) : L.string
        }
        case "array": {
          return L.array(visit(type.items))
        }
        case "object": {
          return L.object(
            Object.fromEntries(Object.entries(type.properties).map(([k, v]) => [k, visit(v)])),
          )
        }
      }
    })()(type.description)
    return type.const ? L.const(initial, type.const) : initial
  }
}
