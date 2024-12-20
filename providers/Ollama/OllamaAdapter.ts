import { assert } from "@std/assert"
import { type Adapter, DEFAULT_INSTRUCTIONS } from "../../client/mod.ts"
import { transform } from "../provider_common.ts"
import type {
  ChatInputMessage,
  ChatOutputMessage,
  ChatRequestBody,
  ChatResponseBody,
  ModelOptions,
} from "./ollama_types.ts"

export interface OllamaProvider {
  M: string
  I: ChatInputMessage
  O: ChatOutputMessage
  E: ModelOptions
}

export function OllamaAdapter({
  endpoint = "http://localhost:11434/api/chat",
  defaultModel,
  defaultInstruction = DEFAULT_INSTRUCTIONS,
}: {
  endpoint?: string
  defaultModel: string
  defaultInstruction?: string
}): Adapter<OllamaProvider> {
  return {
    transform,
    formatInput: (content) => ({
      role: "user",
      content,
    }),
    unwrapOutput: (message) => {
      assert(message.role === "assistant")
      return message.content
    },
    complete: async ({ type, messages, model, options }) => {
      model ??= defaultModel
      if (!messages || !messages.length) {
        messages = [{
          role: "system",
          content: defaultInstruction,
        }]
      }
      const response: ChatResponseBody = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(
          {
            model,
            messages,
            format: type.toJSON(),
            stream: false,
            options,
          } satisfies ChatRequestBody,
        ),
      }).then((v) => v.json())
      return response.message
    },
  }
}
