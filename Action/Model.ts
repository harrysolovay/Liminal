import type { JSONType } from "../Type/JSONType.ts"
import type { Message } from "./Message.ts"

export interface Model {
  type: "Model"
  complete: RequestCompletion
}

export type RequestCompletion = (
  messages: Array<Message>,
  options?: RequestCompletionOptions,
) => Promise<Message>

export type RequestCompletionOptions =
  & {
    signal?: AbortSignal
  }
  & ({
    schema: JSONType
    signature: string
  } | {
    schema?: never
    signature?: never
  })
