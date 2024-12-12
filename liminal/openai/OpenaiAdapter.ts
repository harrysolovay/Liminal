import { assert } from "@std/assert"
import type Openai from "openai"
import type {
  ChatCompletion,
  ChatCompletionCreateParamsBase,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions"
import type { Adapter } from "../client/Adapter.ts"
import { L } from "../core/mod.ts"

export function OpenaiAdapter(
  openai: Openai | typeof Openai,
  model: ChatCompletionCreateParamsBase["model"] = "gpt-4o-mini",
): Adapter<ChatCompletionMessageParam, [instruction?: string]> {
  const client = ("OpenAI" in openai && openai.OpenAI === openai ? new openai() : openai) as Openai
  return {
    text: (role, texts) => ({
      role,
      content: texts.map((text) => ({
        type: "text",
        text,
      })),
    }),
    open: (instruction) => [{
      role: "system",
      content: instruction ?? "",
    }],
    completion: async ({ messages, name, description, type }) => {
      if (!type || type.declaration.factory === L.string) {
        return await client.chat.completions
          .create({
            model,
            messages: [
              ...messages,
              ...description
                ? [{
                  role: "system" as const,
                  content: description,
                }]
                : [],
            ],
          })
          .then(unwrapChoice)
      }
      const Root = type.jsonTypeName === "object"
        ? type
        : L.transform(L.object({ value: type }), ({ value }) => value)
      return await client.chat.completions
        .create({
          model,
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
}

function unwrapChoice(completion: ChatCompletion): string {
  const { choices: [firstChoice] } = completion
  assert(firstChoice, "No choices contained within the completion response.")
  const { finish_reason, message } = firstChoice
  assert(
    finish_reason === "stop",
    `Completion responded with "${finish_reason}" as finish reason; ${message}`,
  )
  const { content, refusal } = message
  assert(!refusal, `Openai refused to fulfill completion request; ${refusal}`)
  assert(content, "First response choice contained no content.")
  return content
}
