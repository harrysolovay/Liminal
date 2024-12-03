import { recombine } from "../util/mod.ts"
import type { Args } from "./Context.ts"
import { integerTag } from "./metadata/integer.ts"
import type { Schema } from "./Schema.ts"
import { type AnyType, type Type, typeKey } from "./Type.ts"
import * as T from "./types.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

export function toSchema<T>(type: Type<T>): Schema {
  return visitor.visit({
    args: {},
    visited: new WeakMap(),
  }, type)
}

export type TypeVisitorContext<R> = {
  args: Args
  visited: WeakMap<AnyType, R>
}

const visitor = new TypeVisitor<TypeVisitorContext<Schema>, Schema>()
  .middleware((next, ctx, type, ...factoryArgs) => {
    if (ctx.visited.has(type)) {
      return ctx.visited.get(type)!
    }
    const args = { ...ctx.args }
    const segments: Array<string> = []
    for (const part of type[typeKey].context.parts) {
      if (part.template) {
        segments.unshift(
          recombine(part.template, part.params.map((paramKey) => ctx.args[paramKey])),
        )
      } else {
        Object.assign(args, part.args)
      }
    }
    const description = segments.length ? segments.join(" ") : undefined
    const schema = {
      description,
      ...next(
        {
          args,
          visited: ctx.visited,
        },
        type,
        ...factoryArgs,
      ),
    }
    ctx.visited.set(type, schema)
    return schema
  })
  .add(T.boolean, () => {
    return { type: "boolean" }
  })
  .add(
    T.number,
    (_0, type) => ({ type: integerTag in type[typeKey].context.metadata ? "integer" : "number" }),
  )
  .add(T.string, () => ({ type: "string" }))
  .add(T.array, (ctx, _1, element): Schema => ({
    type: "array",
    items: visitor.visit(ctx, element),
  }))
  .add(T.object, (ctx, _0, fields): Schema => {
    const keys = Object.keys(fields)
    return {
      type: "object",
      properties: Object.fromEntries(
        keys.map((k) => [k, visitor.visit(ctx, fields[k]!)]),
      ),
      additionalProperties: false,
      required: keys,
    }
  })
  .add(T.option, (ctx, _1, Some): Schema => ({
    anyOf: [{ type: "null" }, visitor.visit(ctx, Some)],
  }))
  .add(T.enum, (_0, _1, ...members) => ({
    type: "string",
    enum: members,
  }))
  .add(T.taggedUnion, (ctx, _1, tagKey, members): Schema => {
    return {
      discriminator: tagKey,
      anyOf: Object.entries(members).map(([k, v]) => ({
        type: "object",
        properties: {
          [tagKey]: {
            type: "string",
            const: k,
          },
          ...(v === undefined ? {} : { value: visitor.visit(ctx, v) }),
        },
        required: [tagKey, ...v === undefined ? [] : ["value"]],
        additionalProperties: false,
      })),
    }
  })
  .add(T.transform, (ctx, _0, _1, from): Schema => visitor.visit(ctx, from))
  .add(T.deferred, (ctx, _0, getType): Schema => visitor.visit(ctx, getType()))