import type { Action, ExtractEvent } from "../Action/mod.ts"
import { Rune } from "../Rune.ts"
import { handle } from "./handle.ts"

export interface Thread<T = any, E = any> extends Rune<"Thread", T, E> {
  source:
    | Array<Thread>
    | (() => Iterator<Action, T, void> | AsyncIterator<Action, T, void>)

  handlers: Handlers

  handle<Y extends Action>(
    f: (event: E) => Iterable<Y, void> | AsyncIterable<Y, void>,
  ): Thread<T, ExtractEvent<Y>>
  handle<R>(
    f: (event: E) => R,
  ): Thread<T, Exclude<Awaited<R>, void>>
}

export type Handlers = Array<(event: unknown) => unknown>

export function Thread<Y extends Action, T>(
  f: () => Iterator<Y, T, void> | AsyncIterator<Y, T, void>,
): Thread<Awaited<T>, ExtractEvent<Y>> {
  return Rune("Thread", {
    ...{} as { E: ExtractEvent<Y> },
    source: f as never,
    handlers: [],
    handle,
  })
}

export namespace Thread {
  export function all<A extends Array<Thread>>(
    ...threads: A
  ): Thread<{ [K in keyof A]: A[K]["T"] }, A[number]["E"]> {
    return Rune("Thread", {
      ...{} as { E: A[number]["E"] },
      source: threads,
      handlers: [],
      handle,
    })
  }
}
