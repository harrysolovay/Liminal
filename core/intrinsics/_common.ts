import { ModelNotFoundError } from "../errors.ts"
import type { State } from "../State.ts"

export async function consumeType(state: State) {
  if (!state.model) {
    throw new ModelNotFoundError()
  }
  if (state.rune.kind === "string") {
    state.onMessage(state.rune.description())
    const message = await state.model.complete(state.messages, undefined)
    state.onMessage(message)
    return message.body
  }
  return undefined!
}
