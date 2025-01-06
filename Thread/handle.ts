import type { Action, ExtractEvent } from "../Action/mod.ts"
import type { Thread } from "./Thread.ts"

export function handle<T, E, Y extends Action>(
  this: Thread<T, E>,
  f: (event: E) => Iterable<Y, void> | AsyncIterable<Y, void>,
): Thread<T, ExtractEvent<Y>>
export function handle<T, E, R>(
  this: Thread<T, E>,
  f: (event: E) => R,
): Thread<T, Exclude<Awaited<R>, void>>
export function handle(
  this: Thread,
  f: (event: unknown) => unknown,
): Thread {
  return Object.assign(this.clone(), {
    handlers: [...this.handlers, f],
  })
}
