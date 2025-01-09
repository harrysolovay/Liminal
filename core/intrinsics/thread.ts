import type { Action } from "../Action/Action.ts"
import { Context } from "../Context.ts"
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
    async consume(ctx) {
      const childCtx = new Context(ctx.model, [...ctx.messages])
      await childCtx.applyPrelude(this)
      const iter = f()
      while (true) {
        const { next } = childCtx
        delete childCtx.next
        const { done, value } = await iter.next(next as never)
        if (done) {
          let result: unknown
          if (final) {
            await childCtx.apply(final)
            result = childCtx.next
          } else {
            result = value
          }
          if (result !== undefined) {
            ctx.onMessage(JSON.stringify(result))
          }
          return result
        }
        await childCtx.apply(value)
      }
    },
  })
}
