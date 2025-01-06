import type { JSONType } from "./JSONType.ts"
import type { Type } from "./Type.ts"
import { Visitor } from "./Visitor.ts"

export function schema(this: Type): JSONType {
  const ctx = new SchemaContext(new Map(), {})
  const root = visit(ctx, this)
  const { $defs } = ctx
  throw 0
}

class SchemaContext {
  constructor(
    readonly ids: Map<Type, string>,
    readonly $defs: Record<string, JSONType>,
  ) {}

  id(type: Type): string {
    let id = this.ids.get(type)
    if (id === undefined) {
      id = this.ids.size.toString()
      this.ids.set(type, id)
    }
    return id
  }
}

const visit: Visitor<SchemaContext, JSONType> = Visitor({
  null() {
    return { type: "null" }
  },
  string() {
    return { type: "string" }
  },
  const(ctx, _1, valueType, value) {
    return {
      ...visit(ctx, valueType)!,
      const: value,
    }
  },
  object(ctx, _1, fields) {
    const required = Object.keys(fields)
    return {
      type: "object",
      properties: Object.fromEntries(required.map((k) => [k, visit(ctx, fields[k]!)])),
      required,
      additionalProperties: false,
    }
  },
  union(ctx, _0, ...members) {
    return {
      anyOf: members.map((member) => visit(ctx, member)),
    }
  },
})
