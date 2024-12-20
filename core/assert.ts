import { assert as assert_, assertArrayIncludes, assertEquals } from "@std/assert"
import type { PartialType, Type } from "./Type.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

export interface Diagnostic {
  type: PartialType
  description?: string
  path: string
  value: unknown
  exception?: unknown
}

export namespace Diagnostic {
  export function toString({ description, exception, path, value }: Diagnostic): string {
    return `Assertion${description ? ` "${description}"` : ""} failed ${
      exception
        ? exception instanceof Error ? `with Error "${exception.name}"` : "with exception"
        : ""
    } on value \`${JSON.stringify(value)}\` at \`root${path}\`: ${
      exception instanceof Error ? exception.message : JSON.stringify(exception)
    }`
  }
}

export async function assert(type: Type<any>, value: unknown): Promise<void> {
  const ctx = new AssertContext([], [], "root", value)
  visit(ctx, type)
  const diagnostics = [
    ...ctx.structuralDiagnostics,
    ...await Promise.all(ctx.annotationDiagnostics ?? []).then((v) => v.filter((e) => !!e)),
  ]
  if (diagnostics.length) {
    throw new AggregateError(diagnostics.map(({ exception }) => exception))
  }
}

export function matchUnionMember(members: Array<PartialType>, value: unknown): PartialType | void {
  const queue = [...members]
  while (queue.length) {
    const current = queue.pop()!
    const diagnostics: Array<Diagnostic> = []
    visit(new AssertContext(diagnostics, undefined, "", value), current)
    if (diagnostics.length) {
      continue
    }
    return current
  }
}

export class AssertContext {
  constructor(
    readonly structuralDiagnostics: Array<Diagnostic>,
    readonly annotationDiagnostics: undefined | Array<Promise<Diagnostic | void>>,
    readonly path: string,
    readonly value: unknown,
    readonly junction?: number | string,
  ) {}

  descend = (value: unknown, junction?: number | string): AssertContext =>
    new AssertContext(
      this.structuralDiagnostics,
      this.annotationDiagnostics,
      this.path,
      value,
      junction,
    )
}

const visit = TypeVisitor<AssertContext, void>({
  hook(next, ctx, type) {
    const path = ctx.junction ? ctx.path : `${ctx.path}["${ctx.junction}"]`
    try {
      next(ctx, type)
    } catch (exception: unknown) {
      ctx.structuralDiagnostics.push({
        type,
        path,
        exception,
        value: ctx.value,
      })
    }
    const { annotationDiagnostics } = ctx
    if (annotationDiagnostics) {
      type.annotations
        .filter((annotation) => typeof annotation === "object" && annotation?.type === "Assertion")
        .forEach(({ f, description }) => {
          if (f) {
            annotationDiagnostics.push((async () => {
              try {
                const passed = await f(ctx.value)
                if (!passed) {
                  return {
                    type,
                    path,
                    description,
                    value: ctx.value,
                  }
                }
              } catch (exception: unknown) {
                return {
                  type,
                  path,
                  exception,
                  description,
                  value: ctx.value,
                }
              }
            })())
          }
        })
    }
  },
  null({ value }) {
    assert_(value === null)
  },
  boolean({ value }) {
    assert_(typeof value === "boolean")
  },
  integer({ value }) {
    assert_(Number.isInteger(value))
  },
  number({ value }) {
    assert_(typeof value === "number")
  },
  string({ value }) {
    assert_(typeof value === "string")
  },
  const({ value }, _1, _2, cmpValue) {
    assertEquals(value, cmpValue)
  },
  enum({ value }, _1, ...values) {
    assert_(typeof value === "string")
    assertArrayIncludes(values, [value])
  },
  array(ctx, _1, element) {
    assert_(Array.isArray(ctx.value))
    ctx.value.forEach((value, i) => visit(ctx.descend(value, i), element))
  },
  object(ctx, _1, fields) {
    const keys = Object.keys(fields).toSorted()
    const { value } = ctx
    assert_(typeof value === "object" && value !== null)
    assertEquals(keys, Object.keys(value).toSorted())
    keys.forEach((key) => visit(ctx.descend(value[key as never], key), fields[key]!))
  },
  transform(ctx, _1, from) {
    visit(ctx, from)
  },
  union(ctx, _1, ...members) {
    const match = matchUnionMember(members, ctx.value)
    assert_(match)
    visit(ctx, match)
  },
  ref(ctx, _1, get) {
    visit(ctx, get())
  },
})
