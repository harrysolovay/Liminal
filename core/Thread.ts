import type { Action } from "./Action/Action.ts"
import { Rune } from "./Rune.ts"
import type { RuneDeclarationBase } from "./RuneDeclaration.ts"

export interface ThreadDeclaration extends RuneDeclarationBase<"Thread"> {
  f: () => Iterator<Action, unknown, void> | AsyncIterator<Action, unknown, void>
}

export function Thread<Y extends Action, T>(
  f: () => Iterator<Y, T, void> | AsyncIterator<Y, T, void>,
): Rune<T, never> {
  return Rune(
    {
      type: "Thread",
      f,
      async consume(state) {
        const iter = f()
        while (true) {
          const { next } = state
          delete state.next
          const { done, value } = await iter.next(next as never)
          if (done) {
            return value
          }
          await state.tick(value)
        }
      },
    },
    [],
    [],
  )
}
