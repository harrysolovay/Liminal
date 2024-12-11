import type { JSONTypes } from "./JSONSchema.ts"
import type { Type } from "./Type.ts"
export * from "./intrinsics/mod.ts"
export * from "./utility/mod.ts"

export function fromJSON<K extends keyof JSONTypes>(
  jsonType: K,
  type: JSONTypes[K],
): Type<K, unknown, never> {
  if ("$ref" in type) {
    type
  } else if ("anyOf" in type) {
    type
  } else {
    switch (type.type) {
      case "null": {
        break
      }
      case "boolean": {
        break
      }
      case "integer": {
        break
      }
      case "number": {
        break
      }
      case "string": {
        break
      }
      case "array": {
        break
      }
      case "object": {
        break
      }
    }
  }
  throw 0
}
