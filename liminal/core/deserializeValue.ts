import type { JSONTypeName } from "./JSONSchema.ts"
import type { Type } from "./Type.ts"
import type { Diagnostic } from "./utility/Diagnostic.ts"

export function deserializeValue<T>(
  this: Type<JSONTypeName, T, never>,
  raw: unknown,
  diagnostics?: Array<Diagnostic>,
): Promise<T> {
  throw 0
}
