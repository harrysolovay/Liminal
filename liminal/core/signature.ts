import { encodeBase32 } from "@std/encoding"
import type { AnyType } from "./Type.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

const signatureCache = new WeakMap<AnyType, string>()
export function signature(this: AnyType): string {
  let signature = signatureCache.get(this)
  if (!signature) {
    const ctx = new VisitContext()
    visit(ctx, this)
    signature = `{\n  ${Object.entries(ctx.defs).map(([k, v]) => `${k}: ${v}`).join("\n  ")}\n}`
    signatureCache.set(this, signature)
  }
  return signature
}

const signatureHashPendingCache = new WeakMap<AnyType, Promise<string>>()
export function signatureHash(this: AnyType): Promise<string> {
  let signatureHashPending = signatureHashPendingCache.get(this)
  if (!signatureHashPending) {
    signatureHashPending = crypto.subtle
      .digest("SHA-256", new TextEncoder().encode(this.signature()))
      .then(encodeBase32)
      .then((v) => v.slice(0, -4))
    signatureHashPendingCache.set(this, signatureHashPending)
  }
  return signatureHashPending
}

class VisitContext {
  ids: Map<AnyType, string> = new Map()
  defs: Record<string, undefined | string> = {}
}

const visit = TypeVisitor<VisitContext, string>({
  hook(next, ctx, type): string {
    const { ids, defs } = ctx
    switch (type.declaration.jsonType) {
      case "array":
      case "object":
      case "union": {
        let id = ids.get(type)
        if (id === undefined) {
          id = ids.size.toString()
          ids.set(type, id)
        }
        if (id in defs) {
          return `id(${id})`
        }
        defs[id] = undefined
        const signature = next(ctx, type)
        defs[id] = signature
        return `id(${id})`
      }
    }
    return next(ctx, type)
  },
  const(_0, _1, _2, value): string {
    if (typeof value === "string") {
      return `"${escapeDoubleQuotes(value)}"`
    }
    return JSON.stringify(value)
  },
  array(ctx, _1, element): string {
    return `L.array(${visit(ctx, element)})`
  },
  object(ctx, _1, fields): string {
    return `L.object({${
      Object
        .entries(fields)
        .map(([k, v]) => `${escapeDoubleQuotes(k)}: ${visit(ctx, v)}`)
        .join(", ")
    }})`
  },
  enum(_0, _1, ...values) {
    return `L.enum("${values.map(escapeDoubleQuotes).join(`", "`)}")`
  },
  union(ctx, _1, ...members): string {
    return `L.union(${members.map((member) => visit(ctx, member)).join(", ")})`
  },
  ref(ctx, _1, get): string {
    return visit(ctx, get())
  },
  transform(ctx, _1, from): string {
    return visit(ctx, from)
  },
  fallback(_0, type) {
    return `L.${type.declaration.jsonType}`
  },
})

function escapeDoubleQuotes(value: string): string {
  return value.indexOf(`"`) !== -1 ? JSON.stringify(value) : value
}
