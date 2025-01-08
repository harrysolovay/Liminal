import type { Action } from "./Action/Action.ts"
import type { DeclarationBase } from "./Declaration.ts"
import { Rune } from "./Rune.ts"

export interface ThreadDeclaration extends DeclarationBase<"Thread"> {
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
