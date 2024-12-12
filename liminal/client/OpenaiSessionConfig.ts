import { assert } from "@std/assert"
import type Openai from "openai"
import type {
  ChatCompletion,
  ChatCompletionCreateParamsBase,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions"
import type { SessionConfig } from "./SessionConfig.ts"

export function OpenaiSessionConfig(getClient: () => Openai): SessionConfig<
  ChatCompletionMessageParam,
  ChatCompletionCreateParamsBase["model"]
> {
  const client = getClient()
  return {
    defaultSystemText: "Generate a value based on the specified structured output schema.",
    defaultModel: "gpt-3.5-turbo",
    toMessage: (text, role) => ({
      role: role,
      content: text,
    }),
    completion: (name, description, jsonType, messages, model) =>
      client.chat.completions.create({
        model,
        messages,
        response_format: {
          type: "json_schema",
          json_schema: {
            name,
            description,
            schema: jsonType,
            strict: true,
          },
        },
      }).then(unwrapChoice),
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
