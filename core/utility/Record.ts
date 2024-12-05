import type { Derived } from "../Derived.ts"
import type { AnyType } from "../Type.ts"
import * as T from "../types/mod.ts"
import { Tuple } from "./Tuple.ts"

export function Record<V extends AnyType>(
  value: V,
): Derived<Record<string, V["T"]>, [V]> {
  return T.transform("Record", T.array(Tuple(T.string, value)), Object.fromEntries)
}
