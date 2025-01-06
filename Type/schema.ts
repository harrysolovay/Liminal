import type { JSONPath, JSONType } from "./JSONType.ts"
import type { Type } from "./Type.ts"
import { Visitor } from "./Visitor.ts"

export function schema(type: Type, ctx: SchemaContext): JSONType {
  return visit(ctx, type)!
}

export class SchemaContext {
  constructor(
    readonly path: JSONPath = [],
    readonly ids: Map<Type, string> = new Map(),
    readonly $defs: Record<string, undefined | JSONType> = {},
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
  hook(next, ctx, type) {
    let jsonType: JSONType
    if (["array", "object", "union"].includes(type.kind)) {
      const id = ctx.id(type)
      if (id in ctx.$defs) {
        return ctx.$defs[id] ?? {
          $ref: id === "0" ? "#" : "#/$defs/${id}",
        }
      } else {
        ctx.$defs[id] = undefined
        jsonType = next(ctx, type)!
        if (ctx.path.length) {
          ctx.$defs[id] = jsonType
        }
      }
    } else {
      jsonType = next(ctx, type)!
    }
    return jsonType
  },
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
    const properties = Object.fromEntries(
      Object.entries(fields).reduce<Array<[string, JSONType]>>((acc, [k, type]) => {
        const v = visit(ctx.next(k), type)
        return v ? [...acc, [k, v]] : acc
      }, []),
    )
    const { "0": _0, ...$defs } = ctx.$defs
    return {
      type: "object",
      properties,
      required: Object.keys(properties),
      additionalProperties: false,
      ...(ctx.path.length || !Object.keys($defs).length) ? {} : { $defs },
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
