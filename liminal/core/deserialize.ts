import type { JSONTypeName } from "./JSONSchema.ts"
import type { Type } from "./Type.ts"

export function deserialize<T>(
  this: Type<JSONTypeName, T, never>,
  value: unknown,
): Promise<T> {
  throw 0
}
