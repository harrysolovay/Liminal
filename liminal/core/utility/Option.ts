import * as I from "../intrinsics/mod.ts"
import type { JSONTypeKind } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"

export function Option<V, P extends symbol>(
  some: Type<JSONTypeKind, V, P>,
): Type<"union", V | null, P> {
  return I.union(I.null, some)
}
