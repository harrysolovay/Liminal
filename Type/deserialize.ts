import type { Schema } from "./Schema.ts"
import { Type } from "./Type.ts"
import { ConstKey } from "./utility/mod.ts"
import { Path, Visitor } from "./Visitor.ts"

export function deserialize(schema: Schema, value: unknown): unknown {
  const deserialized = visit(new VisitState(schema, value, new Path("")), schema.type)
  return schema.type.kind === "object" ? deserialized : (deserialized as any)._lmnl
}

export class VisitState {
  constructor(
    readonly schema: Schema,
    readonly value: unknown,
    readonly path: Path,
  ) {}

  next = (value: unknown, junction?: number | string): VisitState => {
    return new VisitState(this.schema, value, this.path.next(junction))
  }
}

const visit = Visitor<VisitState, unknown>({
  phantom(_0, _1, _2, metadata) {
    if (metadata) {
      if (ConstKey in metadata) {
        return metadata[ConstKey]
      }
    }
  },
  object(state, _1, fields): unknown {
    return Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [
        k,
        visit(state.next((state.value as never)[k], k), v),
      ]),
    )
  },
  union(state, _1, ...members): unknown {
    const { value } = state
    return visit(state, Type.match(members, value)!)
  },
  fallback({ value }) {
    return value
  },
})
