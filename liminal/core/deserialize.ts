import type { Diagnostic } from "./Diagnostic.ts"
import type { JSONTypeKind } from "./JSONSchema.ts"
import type { Type } from "./Type.ts"

export function deserialize<T>(
  this: Type<JSONTypeKind, T, never>,
  raw: unknown,
  diagnostics?: Array<Diagnostic>,
): Promise<T> {
  throw 0
}
