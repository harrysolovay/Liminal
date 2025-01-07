import type { Schema } from "./Schema.ts"
import { Type } from "./Type.ts"
import { ConstKey } from "./utility/mod.ts"
import { Path, Visitor } from "./Visitor.ts"

export interface Deserialization {
  deserialized: unknown
}

export function Deserialization(
  schemaCtx: Schema,
  type: Type,
  value: unknown,
): Deserialization {
  const state = new VisitState(schemaCtx, value, new Path(""))
  const deserialized = visit(state, type)
  return { deserialized }
}

export class VisitState {
  constructor(
    readonly schemaCtx: Schema,
    readonly value: unknown,
    readonly path: Path,
  ) {}

  next = (value: unknown, junction?: number | string): VisitState => {
    return new VisitState(this.schemaCtx, value, this.path.next(junction))
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
