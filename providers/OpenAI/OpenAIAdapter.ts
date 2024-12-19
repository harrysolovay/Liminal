import type Openai from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import type {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions"
import { type Adapter, DEFAULT_INSTRUCTIONS, JSONTypeName, signatureHash } from "../../mod.ts"
import { transform } from "../provider_common.ts"
import { unwrapCompletion, unwrapOutput } from "./openai_util.ts"
import { OpenAIResponseFormat } from "./OpenAIResponseFormat.ts"

export type OpenAIModel = (string & {}) | ChatModel

export interface OpenAIConfig {
  M: (string & {}) | ChatModel
  I: ChatCompletionMessageParam
  O: ChatCompletionMessage
  E: never
}

export function OpenAIAdapter({
  openai,
  defaultModel = "gpt-4o-mini",
  defaultInstruction = DEFAULT_INSTRUCTIONS,
}: {
  openai: Openai
  defaultModel?: OpenAIModel
  defaultInstruction?: string
}): Adapter<OpenAIConfig> {
  return {
    transform,
    formatInput: (content) => ({
      role: "user",
      content,
    }),
    unwrapOutput,
    complete: async ({ name, type, messages, model }) => {
      if (!messages || !messages.length) {
        messages = [{
          role: "system",
          content: defaultInstruction,
        }]
      }
      model ??= defaultModel
      if (JSONTypeName(type) === "string") {
        return openai.chat.completions.create({
          messages,
          model: model ?? defaultModel,
        }).then(unwrapCompletion)
      }
      const response_format = OpenAIResponseFormat(name ?? await signatureHash(type), type)
      return openai.chat.completions
        .create({
          model,
          messages,
          response_format,
        })
        .then(unwrapCompletion)
    },
  }
}
