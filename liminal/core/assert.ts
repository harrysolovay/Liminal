import { isPromise } from "../util/mod.ts"
import type { Diagnostic } from "./Diagnostic.ts"
import type { AnyType } from "./Type.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

export function assert<T>(this: AnyType, value: unknown): void | Promise<void> {
  const diagnostics = collectDiagnostics(this, value)
  if (isPromise(diagnostics)) {
    return diagnostics.then(maybeThrow)
  }
  return maybeThrow(diagnostics)
}

export function collectDiagnostics(
  type: AnyType,
  value: unknown,
): Array<Diagnostic> | Promise<Array<Diagnostic>> {
  const ctx = new VisitContext([], value)
  visit(ctx, type)
  const pending: Array<Promise<Diagnostic | void>> = []
  const diagnostics: Array<Diagnostic> = []
  ctx.diagnostics.forEach((e) => {
    if (isPromise(e)) {
      pending.push(e)
    } else if (e) {
      diagnostics.push(e)
    }
  })
  if (pending.length) {
    return Promise.all(pending).then((v) => {
      v.forEach((d) => {
        if (d) {
          diagnostics.push(d)
        }
      })
      return diagnostics
    })
  }
  return diagnostics
}

function maybeThrow(diagnostics: Array<Diagnostic>) {
  if (diagnostics.length) {
    throw new AggregateError([])
  }
}

class VisitContext {
  constructor(
    readonly diagnostics: Array<Diagnostic | Promise<Diagnostic | void>>,
    readonly value: unknown,
  ) {}
}

const visit = TypeVisitor<VisitContext, void>({
  hook(next, ctx, type) {
    const { diagnostics, value } = ctx
    const { assert } = type.declaration
    if (assert) {
      try {
        assert(value)
      } catch (exception: unknown) {
        diagnostics.push({
          exception,
          type,
          value,
          valuePath: "",
          setValue: () => {},
        })
      }
    }
    type.annotations.forEach((annotation) => {
      if (
        typeof annotation === "object"
        && annotation !== null
        && "type" in annotation
        && annotation.type === "Assertion"
      ) {
        diagnostics.push((async () => {
          try {
            await annotation.f?.(value, ...annotation.args)
          } catch (exception: unknown) {
            return {
              exception,
              type,
              value,
              valuePath: "",
              setValue: () => {},
            }
          }
        })())
      }
    })
    return next(ctx, type)
  },
  fallback() {},
})
