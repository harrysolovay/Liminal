import type * as I from "./intrinsics/mod.ts"
import type { Rune } from "./Rune.ts"
import { Visitor } from "./RuneVisitor.ts"

type I = typeof I

export function signature(rune: Rune): string {
  const state = new SignatureState(new Map(), {})
  visit(state, rune)
  return JSON.stringify(state.visited)
}

const visit: Visitor<SignatureState, void | string> = Visitor({
  hook(next, state, rune) {
    if (["object"].includes(rune.kind)) {
      const id = state.id(rune)
      if (id in state.visited) {
        return `ref(${id})`
      }
      state.visited[id] = undefined
      const signature = visit(state, rune)
      state.visited[id] = signature!
      return signature
    }
    return next(state, rune)
  },
  string() {
    return c.string
  },
  object(state, _1, fields) {
    return c.object + `(${
      Object
        .entries(fields)
        .reduce<string>(
          (acc, [key, rune]) =>
            rune.phantom ? acc : `${acc}${escapeDoubleQuotes(key)}:${visit(state, rune)},`,
          "",
        )
        .slice(0, -1)
    })`
  },
  const(_0, _1, _2, value) {
    return c.const + `(${JSON.stringify(value, null, 0)})`
  },
  deferred(state, _1, get) {
    return visit(state, get())
  },
  thread() {},
})

class SignatureState {
  constructor(
    readonly ids: Map<Rune, string>,
    readonly visited: Record<string, undefined | string>,
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

const c: { [K in Exclude<keyof I, "deferred" | "thread">]: string } = {
  string: "s",
  object: "o",
  const: "c",
}

function escapeDoubleQuotes(value: string): string {
  return value.indexOf(`"`) !== -1 ? JSON.stringify(value) : value
}
