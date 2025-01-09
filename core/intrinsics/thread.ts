import type { Action } from "../Action/Action.ts"
import { Rune } from "../Rune.ts"

export function thread<Y extends Action, T = never>(
  f: () =>
    | Iterator<Y, NoInfer<T> | void, void>
    | AsyncIterator<Y, NoInfer<T> | void, void>,
  final?: Rune<T>,
): Rune<Awaited<T>, never> {
  return Rune({
    kind: "thread",
    self: () => thread,
    args: [f, final],
    phantom: true,
    async consume(state) {
      await state.applyPrelude()
      const iter = f()
      while (true) {
        const { next } = state
        delete state.next
        const { done, value } = await iter.next(next as never)
        if (done) {
          if (final) {
            await state.apply(final)
            return state.next
          }
          return value
        }
        await state.apply(value)
      }
    },
  })
}
