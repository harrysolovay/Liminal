import type { Diagnostic } from "./Diagnostic.ts"
import type { JSONTypeName } from "./JSONSchema.ts"
import type { Type } from "./Type.ts"

export function deserializeValue<T>(
  this: Type<JSONTypeName, T, never>,
  raw: unknown,
  diagnostics?: Array<Diagnostic>,
): Promise<T> {
  throw 0
}
