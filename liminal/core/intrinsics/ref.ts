import { declare } from "../declare.ts"
import type { JSONTypeKind } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"

export function ref<K extends JSONTypeKind, T, P extends symbol, R>(
  get: () => Type<K, T, P>,
): Type<"ref", R, P> {
  return declare("ref", {
    factory: ref,
    args: [get],
  })
}
