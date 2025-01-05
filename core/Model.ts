import type { JSONType } from "./JSON.ts"
import type { Message } from "./Message.ts"

export interface Model {
  type: "Model"
  send: Send
}

export type Send = (messages: Array<Message>, schema?: JSONType) => Promise<Message>
