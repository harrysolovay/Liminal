import type { Schema } from "../Schema.ts"
import type { Message } from "./Message.ts"

export interface Model {
  action: "Model"
  complete: Complete
}

export type Complete = (messages: Array<Message>, schema?: Schema) => Promise<Message>
