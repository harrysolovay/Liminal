import type { Schema } from "../Type/Schema.ts"
import type { Message } from "./Message.ts"

export interface Model {
  type: "Model"
  complete: RequestCompletion
}

export type RequestCompletion = (
  messages: Array<Message>,
  schema?: Schema,
) => Promise<Message>
