import { type AnyType, type Args, T, type Type, typeKey, TypeVisitor } from "../mod.ts"
import { recombine } from "../util/mod.ts"
import { integerTag } from "./metadata/integer.ts"
import type { Schema } from "./Schema.ts"

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
  .middleware((next, ctx, type, ...args) => {
    if (ctx.visited.has(type)) {
      return ctx.visited.get(type)!
    }
    return next(ctx, type, ...args)
  })
  .add(T.boolean, ({ args }, type) => {
    const { description } = processArgs(args, type)
    return {
      description,
      type: "boolean",
    }
  })
  .add(T.number, ({ args }, type) => {
    const { description } = processArgs(args, type)
    return {
      description,
      type: integerTag in type[typeKey].context.metadata ? "integer" : "number",
    }
  }) // TODO: integer – requires metadata
  .add(T.string, ({ args }, type) => {
    const { description } = processArgs(args, type)
    return {
      description,
      type: "string",
    }
  })
  .add(T.array, (ctx, type, element): Schema => {
    const { description, args } = processArgs(ctx.args, type)
    return {
      description,
      type: "array",
      items: visitor.visit({ args, visited: ctx.visited }, element),
    }
  })
  .add(T.object, (ctx, type, fields): Schema => {
    const { description, args } = processArgs(ctx.args, type)
    const keys = Object.keys(fields)
    return {
      description,
      type: "object",
      properties: Object.fromEntries(
        keys.map((k) => [k, visitor.visit({ args, visited: ctx.visited }, fields[k]!)]),
      ),
      additionalProperties: false,
      required: keys,
    }
  })
  .add(T.option, (ctx, type, Some): Schema => {
    const { description, args } = processArgs(ctx.args, type)
    return {
      anyOf: [
        {
          description,
          type: "null",
        },
        visitor.visit({ args, visited: ctx.visited }, Some),
      ],
    }
  })
  .add(T.enum, (ctx, type, ...members) => {
    const { description } = processArgs(ctx.args, type)
    return {
      description,
      type: "string",
      enum: members,
    }
  })
  .add(T.taggedUnion, (ctx, type, tagKey, members): Schema => {
    const { description, args } = processArgs(ctx.args, type)
    return {
      description,
      discriminator: tagKey,
      anyOf: Object.entries(members).map(([k, v]) => ({
        type: "object",
        properties: {
          [tagKey]: {
            type: "string",
            const: k,
          },
          ...(v === undefined ? {} : { value: visitor.visit({ args, visited: ctx.visited }, v) }),
        },
        required: [tagKey, ...v === undefined ? [] : ["value"]],
        additionalProperties: false,
      })),
    }
  })
  .add(T.transform, (parentArgs, _0, _1, from): Schema => visitor.visit(parentArgs, from))
  .add(T.deferred, (parentArgs, _0, getType): Schema => {
    console.log(_0, getType)
    return visitor.visit(parentArgs, getType())
  })

function processArgs(parentArgs: Args, type: AnyType): {
  args: Args
  description: string | undefined
} {
  const args = { ...parentArgs }
  const ctxSegments: Array<string> = []
  for (const part of type[typeKey].context.parts) {
    if (part.template) {
      ctxSegments.unshift(
        recombine(part.template, part.params.map((paramKey) => args[paramKey])),
      )
    } else {
      Object.assign(args, part.args)
    }
  }
  return {
    args,
    description: ctxSegments.length ? ctxSegments.join(" ") : undefined,
  }
}
