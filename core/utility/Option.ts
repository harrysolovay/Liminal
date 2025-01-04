import * as I from "../intrinsics/mod.ts"
import type { Type } from "../Type.ts"

export function Option<V, E>(some: Type<V, E>): Type<V | null, E> {
  return I.union(I.null, some)
}
