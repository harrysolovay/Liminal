import { assert, assertEquals } from "@std/assert"
import { Type } from "./Type.ts"
import { Path, Visitor } from "./Visitor.ts"

export interface Diagnostic {
  type: Type
  path: string
  value: unknown
  exception: unknown
}

export function Diagnostics(
  type: Type,
  value: unknown,
  earlyExit?: boolean,
): Array<Diagnostic> {
  const diagnostics: Array<Diagnostic> = []
  const state = new VisitState(
    diagnostics,
    value,
    new Path(""),
    earlyExit ? new AbortController() : undefined,
  )
  visit(state, type)
  return diagnostics
}

export class VisitState {
  constructor(
    readonly diagnostics: Array<Diagnostic>,
    readonly value: unknown,
    readonly path: Path,
    readonly controller: undefined | AbortController,
  ) {}

  next = (value: unknown, junction?: number | string): VisitState =>
    new VisitState(this.diagnostics, value, this.path.next(junction), this.controller)
}

const visit = Visitor<VisitState, unknown>({
  hook(next, state, type) {
    const { controller } = state
    if (controller) {
      if (controller.signal.aborted) {
        return
      }
      if (state.diagnostics.length) {
        controller.abort()
      }
    }
    try {
      next(state, type)
    } catch (exception: unknown) {
      state.diagnostics.push({
        type,
        path: state.path.inner,
        value: state.value,
        exception,
      })
    }
  },
  fallback() {
    throw 0
  },
  phantom() {},
  null({ value }) {
    assert(value === null)
  },
  string({ value }) {
    assert(typeof value === "string")
  },
  object(ctx, _0, fields) {
    const { value } = ctx
    const keys = Object.keys(fields)
    assert(typeof value === "object" && value !== null)
    assertEquals(keys, Object.keys(value).toSorted())
    keys.forEach((key) => visit(ctx.next(value[key as never], key), fields[key]!))
  },
  union(ctx, _0, ...members) {
    assert(Type.match(members, ctx.value), "Could not match value to union member type.")
  },
})
