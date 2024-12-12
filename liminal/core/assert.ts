import { AssertionContext } from "./AssertionContext.ts"
import type { AnyType } from "./Type.ts"

export async function assert(this: AnyType, value: unknown): Promise<void> {
  const ctx = new AssertionContext("root", [], [])
  ctx.visit(this, value)
  const diagnostics = [
    ...ctx.structuralDiagnostics,
    ...await Promise
      .all(ctx.annotationDiagnostics ?? []).then((v) => v.filter((e) => !!e)),
  ]
  if (diagnostics.length) {
    throw new AggregateError(diagnostics.map(({ exception }) => exception))
  }
}
