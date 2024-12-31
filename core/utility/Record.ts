import * as I from "../intrinsics.ts"
import type { Type } from "../Type.ts"
import { Tuple } from "./Tuple.ts"

export function Record<V, E, P extends symbol>(
  value: Type<V, E, P>,
): Type<Record<string, V>, E, P> {
  return I.f("Record", I.array(Tuple(I.string, value)), Object.fromEntries)
}
