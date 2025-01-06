import type { JSONType } from "../Type/JSONType.ts"
import type { Message } from "./Message.ts"

export interface Model {
  type: "Model"
  complete: RequestCompletion
}

export type RequestCompletion = (messages: Array<Message>, schema?: JSONType) => Promise<Message>
