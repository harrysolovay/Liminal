import type { Action } from "../Action.ts"
import type { Thread } from "../Thread.ts"
import { declareThread } from "./_declareThread.ts"

export function branch<T>(key: string, iterator: Iterator<Action, T>): Thread<T> {
  return declareThread(() => branch, [key, iterator])
}
