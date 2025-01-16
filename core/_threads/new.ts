import type { Action } from "../Action.ts"
import type { Thread } from "../Thread.ts"
import { declareThread } from "./_declareThread.ts"

function new_<T>(key: string, iterator: Iterator<Action, T>): Thread<T> {
  return declareThread(() => new_, [key, iterator])
}
Object.defineProperty(new_, "name", { value: "new" })
export { new_ as new }
