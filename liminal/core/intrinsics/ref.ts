import type { JSONTypeName } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"

export function ref<K extends JSONTypeName, T, P extends symbol, R>(
  get: () => Type<K, T, P>,
): Type<"ref", R, P> {
  throw 0
}
