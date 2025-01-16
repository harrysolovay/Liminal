import type { Message } from "./Message.ts"
import type { Type } from "./Type.ts"

export interface Model {
  kind: "Model"
  complete(type: Type, messages: Array<Message>): Promise<Message>
}
