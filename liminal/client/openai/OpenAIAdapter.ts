import { assert } from "@std/assert"
import type Openai from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import type {
  ChatCompletion,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions"
import { L } from "../../core/mod.ts"
import type { Adapter, AdapterDefaults, LoadThread, SaveThread } from "../Adapter.ts"

export interface OpenAIAdapterDescriptor {
  message: ChatCompletionMessageParam
  role: "system" | "user"
  model: (string & {}) | ChatModel
  messageParams: [prompt?: string]
}

export interface OpenAIAdapterConfig {
  openai: Openai
  loadThread?: LoadThread<OpenAIAdapterDescriptor>
  saveThread?: SaveThread<OpenAIAdapterDescriptor>
}

// instructions: "You are an expert type theorist and ontologist.",

const OPENAI_ADAPTER_DEFAULTS: AdapterDefaults<OpenAIAdapterDescriptor> = {
  model: "gpt-4o-mini",
  role: "user",
}

export function OpenAIAdapter({
  openai,
  loadThread,
  saveThread,
}: OpenAIAdapterConfig): Adapter<OpenAIAdapterDescriptor> {
  return {
    unstructured: ["o1-mini"],
    defaults: OPENAI_ADAPTER_DEFAULTS,
    loadThread: loadThread ?? (() => [{
      role: "system",
      content: [],
    }]),
    saveThread,
    formatMessage: (texts, role) => ({
      role: role ?? OPENAI_ADAPTER_DEFAULTS.role,
      content: texts.map((text) => ({
        type: "text",
        text,
      })),
    }),
    unwrapMessage: ({ content }) => {
      assert(typeof content === "string")
      return content
    },
    completeText,
    completeJSON: async ({ messages, name, description, type, model }) => {
      if (type.declaration.factory === L.string) {
        return completeText([
          ...messages ?? [],
          ...description
            ? [{
              role: "system" as const,
              content: description,
            }]
            : [],
          {
            role: "user",
            content: type.description(),
          },
        ])
      }
      const Root = type.declaration.jsonType === "object"
        ? type
        : L.transform(L.object({ value: type }), ({ value }) => value)
      return await openai.chat.completions
        .create({
          model: model ?? OPENAI_ADAPTER_DEFAULTS.model,
          messages: messages ?? [],
          response_format: {
            type: "json_schema",
            json_schema: {
              name,
              description,
              schema: Root.toJSON(),
              strict: true,
            },
          },
        })
        .then(unwrapChoice)
    },
  }

  function completeText(
    messages: Array<ChatCompletionMessageParam>,
    model?: OpenAIAdapterDescriptor["model"],
  ): Promise<ChatCompletionMessage> {
    return openai.chat.completions.create({
      model: model ?? OPENAI_ADAPTER_DEFAULTS.model,
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
