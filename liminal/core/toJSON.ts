import { DescriptionContext } from "./description.ts"
import type { JSONType, JSONTypeKind, JSONTypes } from "./JSONSchema.ts"
import type { AnyType, Type } from "./Type.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

export function toJSON<K extends JSONTypeKind>(this: Type<K, unknown, any>): JSONTypes[K] {
  const ctx = new VisitContext(
    new Map(),
    {},
    new DescriptionContext(new Map(), {}),
  )
  const root = visit(ctx, this)
  const { "0": _root, ...$defs } = ctx.defs
  return { ...root, $defs } as never
}

class VisitContext {
  constructor(
    readonly ids: Map<AnyType, string>,
    readonly defs: Record<string, undefined | JSONType>,
    readonly descriptionCtx: DescriptionContext,
  ) {}
}

const visit = TypeVisitor<VisitContext, JSONType>({
  hook(next, { descriptionCtx: { args, pins }, ids, defs }, type) {
    let jsonType: JSONType
    args = { ...args }
    const descriptionCtx = new DescriptionContext(pins, args)
    const description = (type as Type<JSONTypeKind, unknown, never>).description(descriptionCtx)
    const ctx = new VisitContext(ids, defs, descriptionCtx)
    switch (type.K) {
      case "array":
      case "object":
      case "union": {
        let id = ids.get(type)
        if (id === undefined) {
          id = ids.size.toString()
          ids.set(type, id)
        }
        if (id in defs) {
          jsonType = defs[id] ?? {
            $ref: `#/$defs/${id}`,
          }
        } else {
          defs[id] = undefined
          defs[id] = next(ctx, type)
        }
        jsonType = next(ctx, type)
        break
      }
      default: {
        jsonType = next(ctx, type)
        break
      }
    }
    return {
      description,
      ...jsonType,
    }
  },
  null() {
    return { type: "null" }
  },
  boolean() {
    return { type: "boolean" }
  },
  integer() {
    return { type: "integer" }
  },
  number() {
    return { type: "number" }
  },
  string() {
    return { type: "string" }
  },
  const(ctx, _1, valueType, value): JSONType {
    return {
      ...visit(ctx, valueType),
      const: value,
    }
  },
  array(ctx, _1, element): JSONType {
    return {
      type: "array",
      items: visit(ctx, element),
    }
  },
  object(ctx, _1, fields): JSONType {
    const required = Object.keys(fields)
    return {
      type: "object",
      properties: Object.fromEntries(required.map((k) => [k, visit(ctx, fields[k]!)])),
      required,
      additionalProperties: false,
    }
  },
  enum(_0, _1, ...values) {
    return {
      type: "string",
      enum: values,
    }
  },
  union(ctx, _1, ...members): JSONType {
    return {
      anyOf: members.map((member) => visit(ctx, member)),
    }
  },
  ref(ctx, _1, get): JSONType {
    return {
      $ref: `#/$defs/${ctx.ids.get(get())!}`,
    }
  },
  transform(ctx, _1, from): JSONType {
    return visit(ctx, from)
  },
})
