import type { JSONTypeName } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"

export function array<T, P extends symbol>(
  type: Type<JSONTypeName, T, P>,
): Type<"array", Array<T>, P> {
  throw 0
}
