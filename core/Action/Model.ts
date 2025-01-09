import type { Context } from "../Context.ts"
import type { Rune } from "../Rune.ts"
import type { Message } from "./Message.ts"

export interface Model {
  action: "Model"
  complete: Complete
}

export type Complete = (state: Context, rune: Rune) => Promise<Message>
