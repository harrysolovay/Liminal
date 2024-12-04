import * as T from "./T.ts"
import type { AnyType, Type } from "./Type.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

// TODO: re-add context

export function display(type: Type<any>): string {
  const ctx = new DisplayVisitorContext()
  visitor.visit(ctx, type)
  console.log(ctx)
  return "TODO"
}

class DisplayVisitorContext {
  signatures: Map<AnyType, string> = new Map()
  signatureIds: Record<string, number> = {}

  ingest = (type: AnyType, makeSignature: () => string): string => {
    let signature = this.signatures.get(type)
    if (signature === undefined) {
      signature = makeSignature()
      this.signatures.set(type, signature)
    }
    let signatureId = this.signatureIds[signature]
    if (signatureId === undefined) {
      signatureId = this.signatures.size - 1
      this.signatureIds[signature] = signatureId
    }
    return `_${signatureId}`
  }
}

const visitor = new TypeVisitor<DisplayVisitorContext, string>()
  .add(T.boolean, () => "T.boolean")
  .add(T.Integer, () => "T.integer")
  .add(T.number, () => "T.number")
  .add(T.string, () => "T.string")
  .add(
    T.array,
    (ctx, type, element): string =>
      ctx.ingest(type, () => `T.array(${visitor.visit(ctx, element)})`),
  )
  .add(T.object, (ctx, type, fields): string =>
    ctx.ingest(
      type,
      () =>
        `T.object({${
          Object.entries(fields).map(([k, v]) => `${k}: ${visitor.visit(ctx, v)}`).join(", ")
        }})`,
    ))
  .add(
    T.option,
    (ctx, type, Some): string => ctx.ingest(type, () => `T.option(${visitor.visit(ctx, Some)})`),
  )
  .add(
    T.enum,
    (ctx, type, ...members) => ctx.ingest(type, () => `T.enum(${members.join(", ")})`),
  )
  .add(T.taggedUnion, (ctx, type, tagKey, members): string => {
    return ctx.ingest(type, () =>
      `T.taggedUnion("${tagKey}", {${
        Object
          .entries(members)
          .map(([k, v]) => `${k}: ${v ? visitor.visit(ctx, v) : "undefined"}`)
          .join(", ")
      }})`)
  })
  .add(
    T.transform,
    (ctx, type, from): string => ctx.ingest(type, () => `T.transform(${visitor.visit(ctx, from)})`),
  )
  .add(
    T.deferred,
    (ctx, type, getType): string => ctx.ingest(type, () => visitor.visit(ctx, getType())),
  )
