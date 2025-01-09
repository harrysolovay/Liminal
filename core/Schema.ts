import { WeakMemo } from "../util/WeakMemo.ts"
import { object } from "./intrinsics/mod.ts"
import type { JSONType } from "./JSONType.ts"
import type { Rune } from "./Rune.ts"
import { RecursiveVisitorState, Visitor } from "./Visitor.ts"

export function schema(rune: Rune): JSONType {
  return schemaMemo.getOrInit(rune)!
}

const schemaMemo = new WeakMemo<Rune, JSONType>((rune) => {
  const root = rune.kind === "object" ? rune : object({ _lmnl: rune })
  return visit(new SchemaState(root, new Map()), root)!
})

class SchemaState extends RecursiveVisitorState {
  $defs: Record<string, undefined | JSONType> = {}
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
