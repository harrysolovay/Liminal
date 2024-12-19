import { type Adapter, DEFAULT_INSTRUCTIONS, toJSONSchema } from "../../mod.ts"
import { transform } from "../provider_common.ts"
import type {
  ChatInputMessage,
  ChatOutputMessage,
  ChatRequestBody,
  ChatResponseBody,
} from "./ollama_types.ts"

export interface OpenAIConfig {
  M: string
  I: ChatInputMessage
  O: ChatOutputMessage
}

export function OpenAIAdapter({
  endpoint,
  defaultModel,
  defaultInstruction = DEFAULT_INSTRUCTIONS,
}: {
  endpoint: string
  defaultModel: string
  defaultInstruction?: string
}): Adapter<OpenAIConfig> {
  return {
    transform,
    formatInput: (content) => ({
      role: "user",
      content,
    }),
    unwrapOutput: (message) => message as never as string,
    complete: async ({ name, type, messages, model }) => {
      model ??= defaultModel
      messages ??= [{
        role: "system",
        content: defaultInstruction,
      }]
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(
          {
            model,
            messages,
            format: toJSONSchema(type),
            stream: false,
            options: {
              temperature: 0,
            },
          } satisfies ChatRequestBody,
        ),
      }).then((v) => v.json() as Promise<ChatResponseBody>)
      return response.message
    },
  }
}

const x = {
  model: "llama3.2",
  messages: [{
    role: "user",
    content:
      "Ollama is 22 years old and busy saving the world. Return a JSON object with the age and availability.",
  }],
  stream: false,
  format: {
    type: "object",
    properties: {
      age: {
        type: "integer",
      },
      available: {
        type: "boolean",
      },
    },
    required: [
      "age",
      "available",
    ],
  },
  options: {
    temperature: 0,
  },
}
