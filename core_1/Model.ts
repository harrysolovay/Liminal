import type { Context } from "./Context.ts"
import type { Message } from "./Message.ts"
import type { Type } from "./Type/Type.ts"

export interface Model {
  action: "Model"
  complete: Complete
}

export type Complete = (state: Context, type: Type) => Promise<Message>
