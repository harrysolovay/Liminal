import * as A from "@std/assert"
import type { AnyType, Type } from "./Type.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

export interface Diagnostic {
  type: AnyType
  path: string
  exception: unknown
  value: unknown
}

export namespace Diagnostic {
  export function toString({ exception, path, value }: Diagnostic): string {
    return `${
      exception instanceof Error ? `Error "${exception.name}"` : "Exception"
    } from value \`${JSON.stringify(value)}\` at \`root${path}\`: ${
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

export function matchUnionMember(members: Array<AnyType>, value: unknown): AnyType | void {
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
        .forEach(({ f, args }) => {
          if (f) {
            annotationDiagnostics.push((async () => {
              try {
                await f(ctx.value, ...args ?? [])
              } catch (exception: unknown) {
                return {
                  type,
                  path,
                  exception,
                  value: ctx.value,
                }
              }
            })())
          }
        })
    }
  },
  null({ value }) {
    A.assert(value === null)
  },
  boolean({ value }) {
    A.assert(typeof value === "boolean")
  },
  integer({ value }) {
    A.assert(Number.isInteger(value))
  },
  number({ value }) {
    A.assert(typeof value === "number")
  },
  string({ value }) {
    A.assert(typeof value === "string")
  },
  const({ value }, _1, _2, cmpValue) {
    A.assertEquals(value, cmpValue)
  },
  enum({ value }, _1, ...values) {
    A.assert(typeof value === "string")
    A.assertArrayIncludes(values, [value])
  },
  array(ctx, _1, element) {
    A.assert(Array.isArray(ctx.value))
    ctx.value.forEach((value, i) => visit(ctx.descend(value, i), element))
  },
  object(ctx, _1, fields) {
    const keys = Object.keys(fields).toSorted()
    const { value } = ctx
    A.assert(typeof value === "object" && value !== null)
    A.assertEquals(keys, Object.keys(value).toSorted())
    keys.forEach((key) => visit(ctx.descend(value[key as never], key), fields[key]!))
  },
  transform(ctx, _1, from) {
    visit(ctx, from)
  },
  union(ctx, _1, ...members) {
    const match = matchUnionMember(members, ctx.value)
    A.assert(match)
    visit(ctx, match)
  },
  ref(ctx, _1, get) {
    visit(ctx, get())
  },
})
