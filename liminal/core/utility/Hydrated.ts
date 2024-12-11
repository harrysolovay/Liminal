import type { JSONType, JSONTypeName, JSONTypes } from "../JSONSchema.ts"
import * as L from "../L.ts"
import type { Type } from "../Type.ts"
export * from "../intrinsics/mod.ts"
export * from "./mod.ts"

export function Hydrated(type: JSONTypes["object"]): Type<"object", unknown, never> {
  const types: Record<string, undefined | Type<JSONTypeName, unknown, never>> = {}
  if (type.$defs) {
    const $defsEntries = Object.entries(type.$defs)
    $defsEntries.forEach(([id]) => {
      types[id] = undefined
    })
    $defsEntries.forEach(([id, jsonType]) => {
      types[id] = visit(jsonType)
    })
  }
  return visit(type) as never

  function visit(type: JSONType): Type<JSONTypeName, unknown, never> {
    if ("$ref" in type) {
      const id = type.$ref.split("#/$defs/").pop()!
      return L.ref(() => types[id]!)
    } else if ("anyOf" in type) {
      return L.union(...type.anyOf.map(visit))
    } else {
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
          return L.string
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
    }
  }
}
