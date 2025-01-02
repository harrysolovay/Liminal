import type { Type } from "../Type.ts"
import * as I from "../types/mod.ts"

export function Option<V, E>(some: Type<V, E>): Type<V | null, E> {
  return I.union(I.null, some)
}
