import type Openai from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import type {
  ChatCompletion,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions"
import {
  type Adapter,
  DEFAULT_INSTRUCTIONS,
  DescriptionContext,
  L,
  signatureHash,
  toJSONSchema,
} from "../../mod.ts"
import { unwrapOutput, unwrapRaw } from "./openai_util.ts"

export type OpenAIAdapter = Adapter<{
  role: "system" | "user"
  model: (string & {}) | ChatModel
  completion: ChatCompletion
  I: ChatCompletionMessageParam
  O: ChatCompletionMessage
}>

export function OpenAIAdapter({
  openai,
  defaultModel = "gpt-4o-mini",
  defaultInstructions = DEFAULT_INSTRUCTIONS,
}: {
  openai: Openai
  defaultModel?: (string & {}) | ChatModel
  defaultInstructions?: string
}): OpenAIAdapter {
  const formatInput: OpenAIAdapter["formatInput"] = (texts, role) => ({
    role: role ?? "system",
    content: texts.filter((v): v is string => !!v).map((text) => ({ type: "text", text })),
  })

  const text: OpenAIAdapter["text"] = (messages, config) =>
    openai.chat.completions.create({
      model: config?.model ?? defaultModel,
      messages,
    })

  return {
    defaults: {
      model: defaultModel,
      role: "user",
      opening: {
        role: "system",
        content: defaultInstructions,
      },
    },
    formatInput,
    unwrapOutput,
    unwrapRaw,
    text,
    value: async (type, { messages, name, description, model }) => {
      messages ??= []
      const descriptionCtx = new DescriptionContext()
      if (type.declaration.factory === L.string) {
        return text([
          ...messages ?? [],
          formatInput([description, descriptionCtx.format(type)], "system"),
        ])
      }
      if (!name) {
        name = await signatureHash(type)
      }
      return openai.chat.completions.create({
        model: model ?? defaultModel,
        messages,
        response_format: {
          type: "json_schema",
          json_schema: {
            name,
            description,
            schema: toJSONSchema(type),
            strict: true,
          },
        },
      })
    },
  }
}
