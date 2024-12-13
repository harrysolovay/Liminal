import { assert } from "@std/assert"
import type Openai from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import type { ChatCompletion, ChatCompletionMessageParam } from "openai/resources/chat/completions"
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
  defaults: AdapterDefaults<OpenAIAdapterDescriptor>
}

export function OpenAIAdapter(
  { openai, defaults, loadThread, saveThread }: OpenAIAdapterConfig,
): Adapter<OpenAIAdapterDescriptor> {
  return {
    unstructured: ["o1-mini"],
    defaults,
    loadThread: loadThread ?? (() => [{
      role: "system",
      content: defaults.instructions,
    }]),
    saveThread,
    formatMessage: (role, texts) => ({
      role,
      content: texts.map((text) => ({
        type: "text",
        text,
      })),
    }),
    completeText,
    completeJSON: async ({ messages, name, description, type, model }) => {
      if (type.declaration.factory === L.string) {
        return completeText([
          ...messages,
          ...description
            ? [{
              role: "system" as const,
              content:
                `Ensure the next assistant message satisfies the following description: ${description}`,
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
          model: model ?? defaults.model,
          messages,
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
        .then(JSON.parse)
    },
  }

  function completeText(
    messages: Array<ChatCompletionMessageParam>,
    model?: OpenAIAdapterDescriptor["model"],
  ): Promise<string> {
    return openai.chat.completions.create({
      model: model ?? defaults.model,
      messages,
    }).then(unwrapChoice)
  }
}

function unwrapChoice(completion: ChatCompletion): string {
  const { choices: [firstChoice] } = completion
  assert(firstChoice, "No choices contained within the completion response.")
  const { finish_reason, message } = firstChoice
  assert(
    finish_reason === "stop",
    `Completion responded with "${finish_reason}" as finish reason; ${message}.`,
  )
  const { content, refusal } = message
  assert(!refusal, `Openai refused to fulfill completion request; ${refusal}.`)
  assert(content, "First response choice contained no content.")
  return content
}
