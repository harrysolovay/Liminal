import { isPromise } from "../util/mod.ts"
import { collectDiagnostics, Diagnostic, DiagnosticContext } from "./Diagnostic.ts"
import type { AnyType } from "./Type.ts"

export async function assert(this: AnyType, value: unknown): Promise<void> {
  const ctx = new DiagnosticContext([], value, "")
  const diagnostics = collectDiagnostics(ctx, this)
  if (isPromise(diagnostics)) {
    return diagnostics.then(Diagnostic.assertNone)
  }
  return Diagnostic.assertNone(diagnostics)
}
