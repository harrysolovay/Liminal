import { WeakMemo } from "../util/mod.ts"
import type { Type } from "./Type.ts"
import { Visitor } from "./Visitor.ts"

export function signature(this: Type): string {
  return signatureMemo.getOrInit(this)
}

const signatureMemo: WeakMemo<Type, string> = new WeakMemo((type) => {
  const ctx = new SignatureContext()
  visit(ctx, type)
  return `{\n  ${Object.entries(ctx.defs).map(([k, v]) => `${k}: ${v}`).join("\n  ")}\n}`
})

class SignatureContext {
  ids: Map<Type, string> = new Map()
  defs: Record<string, undefined | string> = {}
}

const visit = Visitor<SignatureContext, string>({
  hook(next, ctx, type): string {
    const { ids, defs } = ctx
    switch (type.kind) {
      case "array":
      case "object":
      case "union": {
        let id = ids.get(type)
        if (id === undefined) {
          id = ids.size.toString()
          ids.set(type, id)
        }
        if (id in defs) {
          return `i(${id})`
        }
        defs[id] = undefined
        const signature = next(ctx, type)
        defs[id] = signature
        return `i(${id})`
      }
    }
    return next(ctx, type)
  },
  object(ctx, _1, fields): string {
    return `object({ ${
      Object
        .entries(fields)
        .map(([k, v]) => `${escapeDoubleQuotes(k)}: ${visit(ctx, v)}`)
        .join(", ")
    } })`
  },
  union(ctx, _1, ...members): string {
    return `union(${members.map((member) => visit(ctx, member)).join(", ")})`
  },
  fallback(_0, type) {
    return type.kind
  },
})

function escapeDoubleQuotes(value: string): string {
  return value.indexOf(`"`) !== -1 ? JSON.stringify(value) : value
}
