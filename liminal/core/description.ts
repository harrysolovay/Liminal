import type { JSONTypeName } from "./JSONSchema.ts"
import type { Type } from "./Type.ts"

export function description(this: Type<JSONTypeName, any, never>): string {
  throw 0
}
