import { assert, type Falsy } from "@std/assert"
import type Openai from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import type {
  ChatCompletion,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions"
import { DescriptionContext, L } from "../../core/mod.ts"
import type { Adapter, AdapterDefaults, TextConfig } from "../Adapter.ts"
import { DEFAULT_INSTRUCTIONS } from "../constants.ts"

export interface OpenAIAdapterDescriptor {
  message: ChatCompletionMessageParam
  role: "system" | "user"
  model: (string & {}) | ChatModel
  messageParams: [prompt?: string]
}

export interface OpenAIAdapterConfig {
  openai: Openai
  defaultModel?: (string & {}) | ChatModel
  defaultInstructions?: string
}

export function OpenAIAdapter({
  openai,
  defaultModel,
  defaultInstructions,
}: OpenAIAdapterConfig): Adapter<OpenAIAdapterDescriptor> {
  const defaults: AdapterDefaults<OpenAIAdapterDescriptor> = {
    model: defaultModel ?? "chatgpt-4o-latest",
    role: "user",
    opening: {
      role: "system",
      content: defaultInstructions ?? DEFAULT_INSTRUCTIONS,
    },
  }
  return {
    unstructured: ["o1-mini"],
    defaults,
    formatMessage,
    unwrapMessage: ({ content }) => {
      assert(typeof content === "string")
      return content
    },
    text,
    transformType: (type) =>
      type.declaration.jsonType === "object"
        ? type
        : L.transform(L.object({ value: type }), ({ value }) => value),
    value: async (type, { messages, name, description, model }) => {
      messages ??= []
      const descriptionCtx = new DescriptionContext()
      if (type.declaration.factory === L.string) {
        return text([
          ...messages ?? [],
          formatMessage([description, descriptionCtx.format(type)], "system"),
        ])
      }
      if (!name) {
        name = await type.signatureHash()
      }
      return await openai.chat.completions
        .create({
          model: model ?? defaults.model,
          messages,
          response_format: {
            type: "json_schema",
            json_schema: {
              name,
              description,
              schema: type.toJSON(),
              strict: true,
            },
          },
        })
        .then(unwrapChoice)
    },
  }

  function formatMessage(
    texts: Array<string | Falsy>,
    role?: OpenAIAdapterDescriptor["role"],
  ): OpenAIAdapterDescriptor["message"] {
    return {
      role: role ?? defaults.role,
      content: texts
        .filter((v): v is string => !!v)
        .map((text) => ({
          type: "text",
          text,
        })),
    }
  }

  function text(
    messages: Array<ChatCompletionMessageParam>,
    config?: TextConfig<OpenAIAdapterDescriptor>,
  ): Promise<ChatCompletionMessage> {
    return openai.chat.completions.create({
      model: config?.model ?? defaults.model,
      messages,
    }).then(unwrapChoice)
  }
}

function unwrapChoice(completion: ChatCompletion): ChatCompletionMessage {
  const { choices: [firstChoice] } = completion
  assert(firstChoice, "No choices contained within the completion response.")
  const { finish_reason, message } = firstChoice
  assert(
    finish_reason === "stop",
    `Completion responded with "${finish_reason}" as finish reason; ${message}.`,
  )
  const { refusal } = message
  assert(!refusal, `Openai refused to fulfill completion request; ${refusal}.`)
  return message
}
