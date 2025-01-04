import type { JSONType } from "./JSONType.ts"
import type { Message } from "./Message.ts"

export interface Model {
  type: "Model"
  complete: (messages: Array<Message>, schema?: JSONType) => Promise<Message>
}
