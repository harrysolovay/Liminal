import type OpenAI from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import type { L } from "../core/mod.ts"

export declare function openai(
  client: OpenAI,
  model: (string & {}) | ChatModel,
): L.Model
