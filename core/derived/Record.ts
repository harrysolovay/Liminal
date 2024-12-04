import type { Derived } from "../Derived.ts"
import type { AnyType } from "../Type.ts"
import { array, string, transform } from "../types.ts"
import { Tuple } from "./Tuple.ts"

export function Record<V extends AnyType>(
  value: V,
): Derived<Record<string, V["T"]>, [V]> {
  return transform("Record", array(Tuple(string, value)), Object.fromEntries)
}
