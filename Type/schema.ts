import type { JSONType } from "./JSONType.ts"
import type { Type } from "./Type.ts"
import { Path, Visitor } from "./Visitor.ts"

export interface Schema {
  jsonType: JSONType
  phantoms: Record<string, unknown>
}

export function Schema(root: Type): Schema {
  const state = new VisitState(new Path(""), new Map(), {}, {})
  return {
    jsonType: visit(state, root)!,
    phantoms: state.phantoms,
  }
}

class VisitState {
  constructor(
    readonly path: Path,
    readonly ids: Map<Type, string>,
    readonly $defs: Record<string, undefined | JSONType>,
    readonly phantoms: Record<string, unknown>,
  ) {}

  id(type: Type): string {
    let id = this.ids.get(type)
    if (id === undefined) {
      id = this.ids.size.toString()
      this.ids.set(type, id)
    }
    return id
  }

  next = (junction?: number | string): VisitState => {
    return new VisitState(this.path.next(junction), this.ids, this.$defs, this.phantoms)
  }
}

const visit = Visitor<VisitState, void | JSONType>({
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
        if (ctx.path.inner.length) {
          ctx.$defs[id] = jsonType
        }
      }
    } else {
      jsonType = next(ctx, type)!
    }
    return jsonType
  },
  phantom(ctx, _1, _2, metadata) {
    ctx.phantoms[ctx.path.inner] = metadata
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
      ...(ctx.path.inner.length || !Object.keys($defs).length) ? {} : { $defs },
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
