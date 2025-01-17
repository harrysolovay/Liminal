import type { Thread } from "../Thread.ts"
import { declareThread } from "./_declareThread.ts"

export function join<A extends Array<Thread>>(
  ...threads: A
): Thread<{ [K in keyof A]: A[K]["T"] }> {
  return declareThread(() => join<A>, threads)
}
