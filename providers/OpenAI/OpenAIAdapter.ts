import type Openai from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import type {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions"
import { JSONTypeName } from "../../json_schema/mod.ts"
import { type Adapter, DEFAULT_INSTRUCTIONS, L, signatureHash } from "../../mod.ts"
import { unwrapCompletion, unwrapOutput } from "./openai_util.ts"
import { OpenAIResponseFormat } from "./OpenAIResponseFormat.ts"

export type OpenAIModel = (string & {}) | ChatModel

export interface OpenAIConfig {
  M: OpenAIModel
  I: ChatCompletionMessageParam
  O: ChatCompletionMessage
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
    transform: (type) => {
      const jsonTypeName = JSONTypeName(type)
      return jsonTypeName !== "object" && jsonTypeName !== "string"
        ? L.transform(L.Tuple(type), ([value]) => value)
        : type
    },
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
