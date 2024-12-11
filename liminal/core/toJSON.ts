import type { JSONTypeName, JSONTypes } from "./JSONSchema.ts"
import type { Type } from "./Type.ts"

export function toJSON<K extends JSONTypeName>(this: Type<K, any, never>): JSONTypes[K] {
  throw 0
}
