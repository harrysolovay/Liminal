import type { JSONType } from "../../mod.ts"

export interface ChatRequestBody {
  model: string
  messages: Array<ChatInputMessage | ChatOutputMessage>
  stream: false
  format: JSONType
  options?: ModelOptions
}

export interface ChatResponseBody {
  model: string
  created_at: string
  message: ChatOutputMessage
  done_reason: string
  done: boolean
  total_duration: number
  load_duration: number
  prompt_eval_count: number
  prompt_eval_duration: number
  eval_count: number
  eval_duration: number
}

export interface ChatInputMessage {
  role: "system" | "user"
  content: string
}

export interface ChatOutputMessage {
  role: "assistant"
  content: string
}

export interface ModelOptions {
  mirostat?: number
  mirostat_eta?: number
  mirostat_tau?: number
  num_ctx?: number
  repeat_last_n?: number
  repeat_penalty?: number
  temperature?: number
  seed?: number
  stop?: number
  tfs_z?: number
  num_predict?: number
  top_k?: number
  top_p?: number
  min_p?: number
}
