import { assert, type Falsy } from "@std/assert"
import type Openai from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import type { ChatCompletion, ChatCompletionMessageParam } from "openai/resources/chat/completions"
import { DescriptionContext, L } from "../../core/mod.ts"
import type { Adapter, AdapterDefaults, TextConfig } from "../Adapter.ts"
import { DEFAULT_INSTRUCTIONS } from "../constants.ts"

export interface OpenAIAdapterDescriptor {
  message: ChatCompletionMessageParam
  role: "system" | "user"
  model: (string & {}) | ChatModel
  messageParams: [prompt?: string]
  completion: ChatCompletion
}

export interface OpenAIAdapterConfig {
  openai: Openai
  defaultModel?: (string & {}) | ChatModel
  defaultInstructions?: string
  hook?: (completion: ChatCompletion) => void
}

export function OpenAIAdapter({
  openai,
  defaultModel,
  defaultInstructions,
  hook,
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
    hook,
    unwrapMessage: ({ choices: [choice] }) => {
      assert(choice, "No choices contained within the completion response.")
      const { finish_reason, message } = choice
      assert(
        finish_reason === "stop",
        `Completion responded with "${finish_reason}" as finish reason; ${message}.`,
      )
      const { refusal } = message
      assert(!refusal, `Openai refused to fulfill completion request; ${refusal}.`)
      return message
    },
    unwrapContent: ({ content }) => {
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
  ): Promise<ChatCompletion> {
    return openai.chat.completions.create({
      model: config?.model ?? defaults.model,
      messages,
    })
  }
}
