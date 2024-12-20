// TODO: tools
import type { JSONType } from "../../core/mod.ts"

export interface ChatRequestBody {
  /** The model name. */
  model: string
  /** The messages of the chat, this can be used to keep a chat memory. */
  messages: Array<ChatInputMessage | ChatOutputMessage>
  /** Tools for the model to use if supported. Requires `stream` to be set to `false`. */
  tools?: unknown
  /** The format to return a response in. Format can be json or a JSON schema. */
  format: "json" | JSONType
  /** additional model parameters listed in the documentation for the Modelfile such as temperature. */
  options?: ModelOptions
  /** If `false` the response will be returned as a single response object, rather than a stream of objects. */
  stream: boolean
  /** Controls how long the model will stay loaded into memory following the request (default: `5m`). */
  keep_alive?: string
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
  images?: Array<string>
}

export type ChatOutputMessage = {
  role: "assistant"
  /** The content of the message. */
  content: string
  /** A list of images to include in the message (for multimodal models such as llava). */
  images?: Array<string>
} | {
  role: "tool"
  /** A list of tools the model wants to use. */
  tool_calls: Array<unknown> // TODO
}

export interface ModelOptions {
  /** Enable Mirostat sampling for controlling perplexity. (default: 0, 0 = disabled, 1 = Mirostat, 2 = Mirostat 2.0) */
  mirostat?: number
  /** Influences how quickly the algorithm responds to feedback from the generated text. A lower learning rate will result in slower adjustments, while a higher learning rate will make the algorithm more responsive. (Default: 0.1) */
  mirostat_eta?: number
  /** Controls the balance between coherence and diversity of the output. A lower value will result in more focused and coherent text. (Default: 5.0) */
  mirostat_tau?: number
  /** Sets the size of the context window used to generate the next token. (Default: 2048) */
  num_ctx?: number
  /** Sets how far back for the model to look back to prevent repetition. (Default: 64, 0 = disabled, -1 = num_ctx) */
  repeat_last_n?: number
  /** Sets how strongly to penalize repetitions. A higher value (e.g., 1.5) will penalize repetitions more strongly, while a lower value (e.g., 0.9) will be more lenient. (Default: 1.1) */
  repeat_penalty?: number
  /** The temperature of the model. Increasing the temperature will make the model answer more creatively. (Default: 0.8) */
  temperature?: number
  /** Sets the random number seed to use for generation. Setting this to a specific number will make the model generate the same text for the same prompt. (Default: 0) */
  seed?: number
  /** Sets the stop sequences to use. When this pattern is encountered the LLM will stop generating text and return. Multiple stop patterns may be set by specifying multiple separate `stop` parameters in a modelfile. */
  stop?: number
  /** Tail free sampling is used to reduce the impact of less probable tokens from the output. A higher value (e.g., 2.0) will reduce the impact more, while a value of 1.0 disables this setting. (default: 1) */
  tfs_z?: number
  /** Maximum number of tokens to predict when generating text. (Default: -1, infinite generation) */
  num_predict?: number
  /** Reduces the probability of generating nonsense. A higher value (e.g. 100) will give more diverse answers, while a lower value (e.g. 10) will be more conservative. (Default: 40) */
  top_k?: number
  /** Works together with top-k. A higher value (e.g., 0.95) will lead to more diverse text, while a lower value (e.g., 0.5) will generate more focused and conservative text. (Default: 0.9) */
  top_p?: number
  /** Alternative to the top_p, and aims to ensure a balance of quality and variety. The parameter p represents the minimum probability for a token to be considered, relative to the probability of the most likely token. For example, with p=0.05 and the most likely token having a probability of 0.9, logits with a value less than 0.045 are filtered out. (Default: 0.0) */
  min_p?: number
}
