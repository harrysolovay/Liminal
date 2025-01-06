import type { Action, ExtractEvent, Model } from "../Action/mod.ts"
import { Node } from "../Node.ts"
import { run } from "./run.ts"

export interface Thread<T = any, E = any> extends Node<"Thread", Thread, T> {
  E: E

  f: () => Iterator<Action, T, void> | AsyncIterator<Action, T, void>

  handlers: Handlers

  handle<Y extends Action>(
    f: (event: E) => Iterable<Y, void> | AsyncIterable<Y, void>,
  ): Thread<T, ExtractEvent<Y>>
  handle<R>(
    f: (event: E) => R,
  ): Thread<T, Exclude<Awaited<R>, void>>

  run(model: Model): Promise<T>
}

export type Handlers = Array<(event: unknown) => unknown>

export function Thread<Y extends Action, T>(
  f: () => Iterator<Y, T, void> | AsyncIterator<Y, T, void>,
  handlers: Handlers = [],
): Thread<T, ExtractEvent<Y>> {
  return Node("Thread", {
    ...{} as { E: ExtractEvent<Y> },
    f,
    handlers,
    handle() {
      throw 0
    },
    run,
  })
}
