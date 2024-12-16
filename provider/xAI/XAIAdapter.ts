import type { Falsy } from "@std/assert"
import type OpenAI from "openai"
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
import { transformRootType, unwrapOutput, unwrapRaw } from "./xai_util.ts"

export type XAIModel = "grok-beta"

export interface XAIAdapterDescriptor {
  role: "system" | "user"
  model: (string & {}) | XAIModel
  completion: ChatCompletion
  I: ChatCompletionMessageParam
  O: ChatCompletionMessage
}

export interface XAIAdapterConfig {
  xAI: OpenAI
  defaultModel?: (string & {}) | XAIModel
  defaultInstructions?: string
  onCompletion?: (completion: ChatCompletion) => void
}

export function XAIAdapter({
  xAI,
  defaultModel = "grok-beta",
  defaultInstructions = DEFAULT_INSTRUCTIONS,
  onCompletion,
}: XAIAdapterConfig): Adapter<XAIAdapterDescriptor> {
  const defaults: AdapterDefaults<XAIAdapterDescriptor> = {
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
      const completion = await xAI.chat.completions.create({
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
    role?: XAIAdapterDescriptor["role"],
  ): XAIAdapterDescriptor["I"] {
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
    config?: TextConfig<XAIAdapterDescriptor>,
  ): Promise<ChatCompletion> {
    const completion = await xAI.chat.completions.create({
      model: config?.model ?? defaults.model,
      messages,
    })
    onCompletion?.(completion)
    return completion
  }
}
