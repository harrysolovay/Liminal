import { assert, type Falsy } from "@std/assert"
import type Openai from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import type {
  ChatCompletion,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions"
import { Type } from "../../../core/mod.ts"
import { DescriptionContext, L } from "../../core/mod.ts"
import type { Adapter, AdapterDefaults, LoadMessages } from "../Adapter.ts"
import { DEFAULT_INSTRUCTIONS } from "../constants.ts"

export interface OpenAIAdapterDescriptor {
  message: ChatCompletionMessageParam
  role: "system" | "user"
  model: (string & {}) | ChatModel
  messageParams: [prompt?: string]
}

export interface OpenAIAdapterConfig {
  openai: Openai
  defaultModel: (string & {}) | ChatModel
  defaultInstructions?: string
  loadMessages?: LoadMessages<OpenAIAdapterDescriptor>
}

export function OpenAIAdapter({
  openai,
  defaultModel,
  defaultInstructions,
  loadMessages,
}: OpenAIAdapterConfig): Adapter<OpenAIAdapterDescriptor> {
  const defaults: AdapterDefaults<OpenAIAdapterDescriptor> = {
    model: defaultModel,
    instructions: defaultInstructions ?? DEFAULT_INSTRUCTIONS,
    role: "user",
  }
  return {
    unstructured: ["o1-mini"],
    defaults,
    loadMessages: loadMessages ?? (() => [{
      role: "system",
      content: [{
        type: "text",
        text: defaults.instructions,
      }],
    }]),
    formatMessage,
    unwrapMessage: ({ content }) => {
      assert(typeof content === "string")
      return content
    },
    completeText,
    transformType: (type) =>
      type.declaration.jsonType === "object"
        ? type
        : L.transform(L.object({ value: type }), ({ value }) => value),
    completeValue: async ({ messages, name, description, type, model }) => {
      const descriptionCtx = new DescriptionContext()
      const rootTypeDescription = descriptionCtx.format(type)
      if (type.declaration.factory === L.string) {
        return completeText([
          ...messages ?? [],
          formatMessage([description, rootTypeDescription], "system"),
        ])
      }
      if (!name) {
        name = await type.signatureHash()
      }
      messages = !messages?.length
        ? [{
          role: "system",
          content: defaults.instructions,
        }]
        : messages
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

  function completeText(
    messages: Array<ChatCompletionMessageParam>,
    model?: OpenAIAdapterDescriptor["model"],
  ): Promise<ChatCompletionMessage> {
    return openai.chat.completions.create({
      model: model ?? defaults.model,
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
