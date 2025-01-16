import type { Action, ExtractE } from "./Action.ts"
import type { Model } from "./Model.ts"
import type { ThreadE } from "./Thread.ts"

export declare function exec<Y extends Action, T>(
  model: Model,
  thread: Iterator<Y, T> | AsyncIterator<Y, T>,
): AsyncGenerator<ThreadE<ExtractE<Y>>, T, void>
