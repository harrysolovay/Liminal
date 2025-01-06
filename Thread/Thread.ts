import type { Action, ExtractEvent, Model } from "../Action/mod.ts"
import { Node } from "../Node.ts"
import { handle } from "./handle.ts"
import { run, type RunContext } from "./run.ts"

export interface Thread<T = any, E = any> extends Node<"Thread", T> {
  E: E

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

  run(model: Model, ctx?: RunContext): Promise<T>
}

export type Handlers = Array<(event: unknown) => unknown>

export function Thread<Y extends Action, T>(
  f: () => Iterator<Y, T, void> | AsyncIterator<Y, T, void>,
): Thread<T, ExtractEvent<Y>> {
  return Node("Thread", {
    ...{} as { E: ExtractEvent<Y> },
    source: f,
    handlers: [],
    handle,
    run,
  })
}

export namespace Thread {
  export function all<A extends Array<Thread>>(
    ...threads: A
  ): Thread<{ [K in keyof A]: A[K]["T"] }, A[number]["E"]> {
    return Node("Thread", {
      ...{} as { E: A[number]["E"] },
      source: threads,
      handlers: [],
      handle,
      run,
    })
  }
}
