import type { JSONType } from "./JSONType.ts"
import type { Rune } from "./Rune.ts"
import { Visitor } from "./RuneVisitor.ts"
import { signature } from "./signature.ts"

export interface Schema {
  rune: Rune
  name: string
  json: JSONType
}

export function Schema(rune: Rune): Schema {
  const state = new SchemaState(rune, new Map(), {})
  const json = visit(state, rune)!
  return {
    rune: rune,
    name: signature(rune),
    json,
  }
}

const visit: Visitor<SchemaState, JSONType | void> = Visitor({
  hook(next, state, rune) {
    if (["object"].includes(rune.kind)) {
      const id = state.id(rune)
      if (id in state.$defs) {
        return rune === state.root ? { $ref: "#" } : { $ref: `#/$defs/${id}` }
      }
      state.$defs[id] = undefined
      const jsonType = next(state, rune)
      if (rune !== state.root) {
        state.$defs[id] = jsonType!
      }
      return jsonType
    }
    return next(state, rune)
  },
  string() {
    return { type: "string" }
  },
  object(state, rune, fields) {
    const rest = rune === state.root
      ? (() => {
        const { "0": _, ...$defs } = state.$defs
        return Object.keys($defs).length ? { $defs } : {}
      })()
      : {}
    return {
      type: "object",
      properties: Object.entries(fields).reduce((acc, [key, rune]) => ({
        ...acc,
        ...rune.phantom ? {} : { [key]: visit(state, rune) },
      }), {}),
      required: Object.keys(fields),
      additionalProperties: false,
      ...rest,
    }
  },
  const() {},
  deferred(state, _1, get) {
    return visit(state, get())
  },
  thread() {},
})

class SchemaState {
  constructor(
    readonly root: Rune,
    readonly ids: Map<Rune, string>,
    readonly $defs: Record<string, undefined | JSONType>,
  ) {}

  id(rune: Rune): string {
    let id = this.ids.get(rune)
    if (id === undefined) {
      id = this.ids.size.toString()
      this.ids.set(rune, id)
    }
    return id
  }
}
