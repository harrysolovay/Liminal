import type { Type } from "../../core/mod.ts"
import { array, number, string, transform } from "../types.ts"
import { Tuple } from "./Tuple.ts"
import { Union } from "./Union.ts"

export function Record<T, P extends keyof any>(
  value: Type<T, P>,
): Type<Record<number | string, T>, P> {
  return transform(array(Tuple(Union(number, string), value)), Object.fromEntries)
}
