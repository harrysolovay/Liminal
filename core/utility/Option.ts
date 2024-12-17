import * as I from "../intrinsics.ts"
import type { Type } from "../Type.ts"

export function Option<V, P extends symbol>(some: Type<V, P>): Type<V | null, P> {
  return I.union(I.null, some)
}
