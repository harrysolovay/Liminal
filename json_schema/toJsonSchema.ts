import { type Args, type Type, typeKey, TypeVisitorContext } from "../core/mod.ts"
import type { AnyType } from "../mod.ts"
import * as T from "../types/mod.ts"
import { recombine } from "../util/mod.ts"
import type { Schema } from "./Schema.ts"

export function toJsonSchema<T>(type: Type<T>): Schema {
  return visitor.visit({}, type)
}

const visitor = new TypeVisitorContext<Args, Schema>()
  .add(T.boolean, (args, type) => {
    const { description } = processArgs(args, type)
    return {
      description,
      type: "boolean",
    }
  })
  .add(T.number, (args, type) => {
    const { description } = processArgs(args, type)
    return {
      description,
      type: "number",
    }
  }) // TODO: integer
  .add(T.string, (args, type) => {
    const { description } = processArgs(args, type)
    return {
      description,
      type: "string",
    }
  })
  .add(T.array, (parentArgs, type, element): Schema => {
    const { description, args } = processArgs(parentArgs, type)
    return {
      description,
      type: "array",
      items: visitor.visit(args, element),
    }
  })
  .add(T.object, (parentArgs, type, fields): Schema => {
    const { description, args } = processArgs(parentArgs, type)
    const keys = Object.keys(fields)
    return {
      description,
      type: "object",
      properties: Object.fromEntries(keys.map((k) => [k, visitor.visit(args, fields[k]!)])),
      additionalProperties: false,
      required: keys,
    }
  })
  .add(T.option, (parentArgs, type, Some): Schema => {
    const { description, args } = processArgs(parentArgs, type)
    return {
      anyOf: [
        {
          description,
          type: "null",
        },
        visitor.visit(args, Some),
      ],
    }
  })
  .add(T.enum, (parentArgs, type, ...members) => {
    const { description } = processArgs(parentArgs, type)
    return {
      description,
      type: "string",
      enum: members,
    }
  })
  .add(T.taggedUnion, (parentArgs, type, tagKey, members): Schema => {
    const { description, args } = processArgs(parentArgs, type)
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
          ...(v === null ? {} : { value: visitor.visit(args, v) }),
        },
        required: [tagKey, ...v === null ? [] : ["value"]],
        additionalProperties: false,
      })),
    }
  })
  .add(T.transform, (parentArgs, _0, _1, from): Schema => visitor.visit(parentArgs, from))

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
