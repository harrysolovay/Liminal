import { type Adapter, DEFAULT_INSTRUCTIONS, toJSONSchema } from "../../mod.ts"
import { transform } from "../provider_common.ts"
import type {
  ChatInputMessage,
  ChatOutputMessage,
  ChatRequestBody,
  ChatResponseBody,
} from "./ollama_types.ts"

export interface OllamaConfig {
  M: string
  I: ChatInputMessage
  O: ChatOutputMessage
}

export function OllamaConfig({
  endpoint,
  defaultModel,
  defaultInstruction = DEFAULT_INSTRUCTIONS,
}: {
  endpoint: string
  defaultModel: string
  defaultInstruction?: string
}): Adapter<OllamaConfig> {
  return {
    transform,
    formatInput: (content) => ({
      role: "user",
      content,
    }),
    unwrapOutput: (message) => message.content,
    complete: async ({ type, messages, model }) => {
      model ??= defaultModel
      messages ??= [{
        role: "system",
        content: defaultInstruction,
      }]
      const response: ChatResponseBody = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(
          {
            model,
            messages,
            format: toJSONSchema(type),
            stream: false,
          } satisfies ChatRequestBody,
        ),
      }).then((v) => v.json())
      return response.message
    },
  }
}
