import * as I from "../intrinsics/mod.ts"
import type { JSONType } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"

export function Hydrated(type: JSONType): Type<unknown, never> {
  const types: Record<string, undefined | Type<unknown, never>> = {}
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

  function visit(type: JSONType) {
    return ((): Type<unknown, never> => {
      if ("$ref" in type) {
        const id = type.$ref.split("#/$defs/").pop()!
        return I.ref(() => types[id]!)
      } else if ("anyOf" in type) {
        return I.union(...type.anyOf.map(visit))
      } else {
        switch (type.type) {
          case "null": {
            return I.null
          }
          case "boolean": {
            return I.boolean
          }
          case "integer": {
            return I.integer
          }
          case "number": {
            return I.number
          }
          case "string": {
            return I.string
          }
          case "array": {
            return I.array(visit(type.items))
          }
          case "object": {
            return I.object(
              Object.fromEntries(Object.entries(type.properties).map(([k, v]) => [k, visit(v)])),
            )
          }
        }
      }
    })()(type.description)
  }
}
