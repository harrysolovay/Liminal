import type { JSONPath, JSONType } from "./JSONType.ts"
import type { Type } from "./Type.ts"
import { Visitor } from "./Visitor.ts"

export function schema(this: Type): JSONType {
  const ctx = new SchemaContext()
  const root = visit(ctx, this)
  const { $defs } = ctx
  throw 0
}

class SchemaContext {
  constructor(
    readonly path: JSONPath = [],
    readonly ids: Map<Type, string> = new Map(),
    readonly $defs: Record<string, JSONType> = {},
    readonly phantoms: Array<[type: Type, metadata: unknown]> = [],
  ) {}

  id(type: Type): string {
    let id = this.ids.get(type)
    if (id === undefined) {
      id = this.ids.size.toString()
      this.ids.set(type, id)
    }
    return id
  }

  next = (junction?: number | string): SchemaContext => {
    return new SchemaContext(
      junction ? [...this.path, junction] : this.path,
      this.ids,
      this.$defs,
      this.phantoms,
    )
  }
}

const visit = Visitor<SchemaContext, void | JSONType>({
  phantom(ctx, _1, type, metadata) {
    ctx.phantoms.push([type, metadata])
  },
  null() {
    return { type: "null" }
  },
  string() {
    return { type: "string" }
  },
  object(ctx, _1, fields): JSONType {
    const required = Object.keys(fields)
    return {
      type: "object",
      properties: Object.fromEntries(required.map((k) => [k, visit(ctx.next(k), fields[k]!)])),
      required,
      additionalProperties: false,
    }
  },
  union(ctx, _0, ...members): JSONType {
    return {
      anyOf: members.map((member, i) =>
        visit(ctx, member) ?? {
          type: "string" as const,
          const: `_lmnl_${i}`,
        }
      ),
    }
  },
})
