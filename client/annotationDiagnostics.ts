import { outdent } from "@cspotcode/outdent"
import { assert } from "@std/assert"
import { AssertContext } from "../core/AssertContext.ts"
import type { Diagnostic } from "../core/Diagnostic.ts"
import { matchUnionMember } from "../core/methods/assert.ts"
import { type AnyType, L } from "../core/mod.ts"
import { TypeVisitor } from "../core/TypeVisitor.ts"
import type { Provider } from "./Adapter.ts"
import type { Liminal } from "./Liminal.ts"

export function annotationDiagnostics<T>(
  liminal: Liminal<Provider>,
  type: AnyType<T>,
  value: unknown,
): Promise<Array<Diagnostic>> {
  const diagnostics: Array<Promise<Diagnostic | void>> = []
  visit(new AssertContext(liminal, diagnostics, "root", value), type)
  return Promise.all(diagnostics).then((diagnostics) =>
    diagnostics.filter((v): v is Diagnostic => v !== undefined)
  )
}

const visit = TypeVisitor<AssertContext<Liminal<Provider>, Promise<Diagnostic | void>>, void>({
  hook(next, ctx, type) {
    type.annotations
      .filter((annotation) => typeof annotation === "object" && annotation?.node === "Assertion")
      .forEach(({ f, description }) => {
        if (f) {
          ctx.diagnostics.push((async () => {
            try {
              const is = await f(ctx.value)
              if (typeof is === "boolean" && !is) {
                return {
                  type,
                  path: ctx.path,
                  description,
                  value: ctx.value,
                }
              }
            } catch (exception: unknown) {
              return {
                type,
                path: ctx.path,
                exception,
                description,
                value: ctx.value,
              }
            }
          })())
        } else {
          ctx.ctx(outdent`
            Is the assertion "${description}" true for the following value?

            \`\`\`
            ${JSON.stringify(ctx.value, null, 2)}
            \`\`\
          `)
          return ctx.ctx.value(L.Option(L.string`Reason behind the assertion failure.`))
            .then((exception) => {
              if (typeof exception === "string") {
                return {
                  type,
                  path: ctx.path,
                  exception,
                  description,
                  value: ctx.value,
                }
              }
            })
        }
      })
    next(ctx, type)
  },
  array(ctx, _1, element) {
    ;(ctx.value as Array<unknown>).forEach((value, i) => visit(ctx.descend(value, i), element))
  },
  object(ctx, _1, fields) {
    Object
      .entries(ctx.value as Record<string, unknown>)
      .forEach(([k, v]) => visit(ctx.descend(v, k), fields[k]!))
  },
  f(ctx, _1, _2, from) {
    visit(ctx, from)
  },
  union(ctx, _1, ...members) {
    const match = matchUnionMember(members, ctx.value)
    assert(match)
    visit(ctx, match)
  },
  deferred(ctx, _1, get) {
    visit(ctx, get())
  },
  fallback() {},
})
