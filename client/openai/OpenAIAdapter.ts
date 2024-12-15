import type { Falsy } from "@std/assert"
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
  hook?: (completion: ChatCompletion) => void
}

export function OpenAIAdapter({
  openai,
  defaultModel,
  defaultInstructions,
  hook,
}: OpenAIAdapterConfig): Adapter<OpenAIAdapterDescriptor> {
  const defaults: AdapterDefaults<OpenAIAdapterDescriptor> = {
    model: defaultModel ?? "gpt-4o-mini",
    role: "user",
    opening: {
      role: "system",
      content: defaultInstructions ?? DEFAULT_INSTRUCTIONS,
    },
  }
  return {
    defaults,
    formatInput,
    hook,
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
