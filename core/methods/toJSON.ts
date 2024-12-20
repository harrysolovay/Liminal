import { isType } from "../isType.ts"
import type { JSONType } from "../JSONSchema.ts"
import type { PartialType, Type } from "../Type.ts"
import { TypeVisitor } from "../TypeVisitor.ts"
import { DescriptionContext } from "./description.ts"

export function toJSON(this: Type<unknown, any>): JSONType {
  const ctx = new VisitorContext(
    new Map(),
    {},
    new DescriptionContext(new Map(), {}),
  )
  const root = visit(ctx, this)
  const { "0": _root, ...$defs } = ctx.defs
  return { ...root, $defs } as never
}

class VisitorContext {
  constructor(
    readonly ids: Map<PartialType, string>,
    readonly defs: Record<string, undefined | JSONType>,
    readonly descriptionCtx: DescriptionContext,
  ) {}

  id(type: PartialType): string {
    let id = this.ids.get(type)
    if (id === undefined) {
      id = this.ids.size.toString()
      this.ids.set(type, id)
    }
    return id
  }
}

const visit = TypeVisitor<VisitorContext, JSONType>({
  hook(next, { descriptionCtx: { args, pins }, ids, defs }, type) {
    let jsonType: JSONType
    args = { ...args }
    const descriptionCtx = new DescriptionContext(pins, args)
    const description = descriptionCtx.format(type as never)
    const ctx = new VisitorContext(ids, defs, descriptionCtx)
    if (isType(type, "array", "object", "union")) {
      const id = ctx.id(type)
      if (id in defs) {
        return defs[id] ?? {
          $ref: id === "0" ? "#" : `#/$defs/${id}`,
        }
      } else {
        defs[id] = undefined
        jsonType = next(ctx, type)
        defs[id] = jsonType
      }
    } else {
      jsonType = next(ctx, type)
    }
    return { description, ...jsonType }
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
    return visit(ctx, get())
  },
  transform(ctx, _1, from): JSONType {
    return visit(ctx, from)
  },
})
