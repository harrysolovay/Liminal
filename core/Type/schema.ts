import { WeakMemo } from "../../util/WeakMemo.ts"
import { object } from "../_types/object.ts"
import { RecursiveVisitorState } from "../RecursiveVisitorState.ts"
import { Type } from "../Type.ts"
import { Visitor } from "../Visitor.ts"
import type { JSONType } from "./JSONType.ts"

export function schema(this: Type): JSONType {
  return memo.getOrInit(this)
}

const memo = new WeakMemo<Type, JSONType>((type) => {
  const root = type.self() === object ? type : object({ _lmnl: type })
  return visit(new SchemaState(root, new Map()), type)
})

class SchemaState extends RecursiveVisitorState {
  $defs: Record<string, undefined | JSONType> = {}
}

export const visit = Visitor<typeof Type, SchemaState, JSONType>(Type, {
  hook(next, state, type) {
    if (type.self() === object) {
      const id = state.id(type)
      if (id in state.$defs) {
        return type === state.root ? { $ref: "#" } : { $ref: `#/$defs/${id}` }
      }
      state.$defs[id] = undefined
      const jsonType = next(state, type)
      if (type !== state.root) {
        state.$defs[id] = jsonType!
      }
      return jsonType
    }
    return next(state, type)
  },
  string() {
    return { type: "string" }
  },
  object(state, type, fields): JSONType {
    const rest = type === state.root
      ? (() => {
        const { "0": _, ...$defs } = state.$defs
        return Object.keys($defs).length ? { $defs } : {}
      })()
      : {}
    return {
      type: "object",
      properties: Object.fromEntries(
        Object.entries(fields).map(([key, type]) => [key, visit(state, type)]),
      ),
      required: Object.keys(fields),
      additionalProperties: false,
      ...rest,
    }
  },
})
