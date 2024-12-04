import type { Type } from "../Type.ts"
import { array, string, transform } from "../types.ts"
import { Tuple } from "./Tuple.ts"

export function Record<T, P extends keyof any>(
  value: Type<T, P>,
): Type<Record<string, T>, P> {
  return transform("Record", array(Tuple(string, value)), Object.fromEntries)
}
