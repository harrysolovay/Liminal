import type * as I from "./intrinsics/mod.ts"
import type { Rune } from "./Rune.ts"
import { RecursiveVisitorState, Visitor } from "./Visitor.ts"

type I = typeof I

export function signature(rune: Rune): string {
  const state = new SignatureState(rune, new Map())
  visit(state, rune)
  return Object
    .entries(state.visited)
    .reduce<string>((acc, [key, signature]) => `${acc}${key}:${signature},`, "")
    .slice(0, -1)
}

class SignatureState extends RecursiveVisitorState {
  visited: Record<string, undefined | string> = {}
}

const visit: Visitor<SignatureState, void | string> = Visitor({
  hook(next, state, rune) {
    if (["object"].includes(rune.kind)) {
      const id = state.id(rune)
      if (id in state.visited) {
        return c.ref + `(${id})`
      }
      state.visited[id] = undefined
      const signature = next(state, rune)
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
        .reduce<string>((acc, [key, rune]) =>
          rune.phantom ? acc : `${acc}${escapeDoubleQuotes(key)}:${visit(state, rune)},`, "")
        .slice(0, -1)
    })`
  },
  const() {},
  deferred(state, _1, get) {
    return visit(state, get())
  },
  thread() {},
})

const c: { [K in Exclude<keyof I, "deferred" | "thread">]: string } & {
  ref: "r"
} = {
  string: "s",
  object: "o",
  const: "c",
  ref: "r",
}

function escapeDoubleQuotes(value: string): string {
  return value.indexOf(`"`) !== -1 ? JSON.stringify(value) : value
}
