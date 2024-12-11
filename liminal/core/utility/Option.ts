import * as L from "../intrinsics/mod.ts"
import type { JSONTypeName } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"

export function Option<V, P extends symbol>(
  some: Type<JSONTypeName, V, P>,
): Type<"union", V | null, P> {
  return L.union(L.null, some)
}
