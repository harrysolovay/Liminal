import * as I from "../intrinsics/mod.ts"
import type { JSONTypeName } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"
import { Tuple } from "./Tuple.ts"

export function Record<V, P extends symbol>(
  value: Type<JSONTypeName, V, P>,
): Type<"array", Record<string, V>, P> {
  return I.transform(I.array(Tuple(I.string, value)), Object.fromEntries)
}
