import * as I from "../intrinsics.ts"
import type { Type } from "../Type.ts"

export function Option<V, E, D extends symbol>(some: Type<V, E, D>): Type<V | null, E, D> {
  return I.union(I.null, some)
}
