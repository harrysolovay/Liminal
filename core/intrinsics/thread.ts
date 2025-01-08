import type { Action } from "../Action/Action.ts"
import { Rune } from "../Rune.ts"

export function thread<Y extends Action, T>(
  f: () => Iterator<Y, T, void> | AsyncIterator<Y, T, void>,
): Rune<Awaited<T>, never> {
  return Rune({
    kind: "thread",
    self: () => thread,
    args: [f],
    async consume(state) {
      await state.applyPrelude()
      const iter = f()
      while (true) {
        const { next } = state
        delete state.next
        const { done, value } = await iter.next(next as never)
        if (done) {
          return value
        }
        await state.apply(value)
      }
    },
  })
}
