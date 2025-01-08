import type { DeclarationBase } from "./Declaration.ts"
import { ModelNotFoundError } from "./errors.ts"
import { Rune } from "./Rune.ts"

export interface TypeDeclaration extends DeclarationBase<"Type"> {
  kind: string
  self: () => Rune | ((...args: any) => Rune)
  args?: Array<unknown>
}

export function Type<T, E>(
  kind: string,
  self: () => Rune | ((...args: any) => Rune),
  args?: Array<unknown>,
): Rune<T, E> {
  return Rune(
    {
      type: "Type",
      kind,
      self,
      args,
      async consume(state) {
        if (!state.model) {
          throw new ModelNotFoundError()
        }
        if (kind === "string") {
          state.onMessage(state.rune.description())
          const message = await state.model.complete(state.messages, undefined)
          state.onMessage(message)
          return message.body
        }
        return undefined!
      },
    },
    [],
    [],
  )
}
