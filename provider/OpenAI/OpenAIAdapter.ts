import type { Falsy } from "@std/assert"
import type Openai from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import type {
  ChatCompletion,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions"
import {
  type Adapter,
  type AdapterDefaults,
  DEFAULT_INSTRUCTIONS,
  DescriptionContext,
  L,
  type TextConfig,
} from "../../mod.ts"
import { transformRootType, unwrapOutput, unwrapRaw } from "./openai_util.ts"

export interface OpenAIAdapterDescriptor {
  role: "system" | "user"
  model: (string & {}) | ChatModel
  completion: ChatCompletion
  I: ChatCompletionMessageParam
  O: ChatCompletionMessage
}

export interface OpenAIAdapterConfig {
  openai: Openai
  defaultModel?: (string & {}) | ChatModel
  defaultInstructions?: string
  onCompletion?: (completion: ChatCompletion) => void
}

export function OpenAIAdapter({
  openai,
  defaultModel = "gpt-4o-mini",
  defaultInstructions = DEFAULT_INSTRUCTIONS,
  onCompletion,
}: OpenAIAdapterConfig): Adapter<OpenAIAdapterDescriptor> {
  const defaults: AdapterDefaults<OpenAIAdapterDescriptor> = {
    model: defaultModel,
    role: "user",
    opening: {
      role: "system",
      content: defaultInstructions,
    },
  }
  return {
    defaults,
    formatInput,
    unwrapOutput,
    unwrapRaw,
    text,
    transformRootType,
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
        name = await type.signatureHash()
      }
      const completion = await openai.chat.completions.create({
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
      onCompletion?.(completion)
      return completion
    },
  }

  function formatInput(
    texts: Array<string | Falsy>,
    role?: OpenAIAdapterDescriptor["role"],
  ): OpenAIAdapterDescriptor["I"] {
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

  async function text(
    messages: Array<ChatCompletionMessageParam>,
    config?: TextConfig<OpenAIAdapterDescriptor>,
  ): Promise<ChatCompletion> {
    const completion = await openai.chat.completions.create({
      model: config?.model ?? defaults.model,
      messages,
    })
    onCompletion?.(completion)
    return completion
  }
}
