import type { Action } from "./Action.ts"
import type { Emit } from "./Emit.ts"
import type { Flow } from "./Flow.ts"
import type { Thread } from "./Thread/Thread.ts"

export type ExtractE<F extends Flow | Action> = F extends Flow<any, infer Y>
  ? Extract<Y, Emit>["event"]
  : Extract<F, Thread>["E"]
