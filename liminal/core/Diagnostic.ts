import { isPromise } from "../util/mod.ts"
import type { AnyType } from "./mod.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

export interface Diagnostic {
  exception: unknown
  type: AnyType
  value: unknown
  valuePath: string
  setValue: (parentValue: unknown) => void
}

export namespace Diagnostic {
  export function toString({ exception, valuePath, value }: Diagnostic): string {
    return `${
      exception instanceof Error ? `Error "${exception.name}"` : "Exception"
    } from value \`${JSON.stringify(value)}\` at \`root${valuePath}\`: ${
      exception instanceof Error ? exception.message : JSON.stringify(exception)
    }`
  }

  export function assertNone(diagnostics: Array<Diagnostic>) {
    if (diagnostics.length) {
      throw new AggregateError(diagnostics.map((d) => d.exception))
    }
  }
}

type Pending = Promise<Diagnostic | Array<Diagnostic> | void>

export async function collectDiagnostics(
  ctx: DiagnosticContext,
  type: AnyType,
): Promise<Array<Diagnostic>> {
  visit(ctx, type)
  const pending: Array<Pending> = []
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

export class DiagnosticContext {
  constructor(
    readonly diagnostics: Array<Diagnostic | Pending>,
    readonly value: unknown,
    readonly valuePath: string,
  ) {}
}

const visit = TypeVisitor<DiagnosticContext, void>({
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
    next(ctx, type)
  },
  const(ctx, _1, type, value) {
    visit(new DiagnosticContext(ctx.diagnostics, value, ctx.valuePath), type)
  },
  array(ctx, _1, element) {
    ;(ctx.value as Array<never>).forEach((value, i) =>
      visit(new DiagnosticContext(ctx.diagnostics, value, `${ctx.valuePath}[${i}]`), element)
    )
  },
  object(ctx, _1, fields) {
    Object.entries(fields).forEach(([k, v]) => {
      visit(
        new DiagnosticContext(ctx.diagnostics, (ctx.value as never)[k], `${ctx.valuePath}[${k}]`),
        v,
      )
    })
  },
  union(ctx, _1, ...members) {
    const ctxs: Array<DiagnosticContext> = []
    members.forEach((member) => {
      const memberCtx = new DiagnosticContext([], ctx.value, ctx.valuePath)
      ctxs.push(memberCtx)
      visit(memberCtx, member)
    })
    ctx.diagnostics.push(
      Promise
        .all(ctxs.map((ctx) => Promise.all(ctx.diagnostics).then((v) => v.filter((e) => !!e))))
        .then((groups) => groups.find((v) => !!v.length))
        .then((v) => {
          if (v) {
            return v.flat()
          }
        }),
    )
  },
  ref(ctx, _1, get) {
    visit(ctx, get())
  },
  transform(ctx, _1, from) {
    visit(ctx, from)
  },
  fallback() {},
})
