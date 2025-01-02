import { assert } from "@std/assert"
import type { ChatCompletion, ChatCompletionMessage } from "openai/resources/chat/completions"

export function unwrapCompletion({ choices: [choice] }: ChatCompletion): ChatCompletionMessage {
  assert(choice, "No choices contained within the completion response.")
  const { finish_reason, message } = choice
  assert(
    finish_reason === "stop",
    `Completion responded with "${finish_reason}" as finish reason; ${message}.`,
  )
  const { refusal } = message
  assert(!refusal, `Openai refused to fulfill completion request; ${refusal}.`)
  return message
}

export function unwrapOutput({ content }: ChatCompletionMessage): string {
  assert(typeof content === "string")
  return content
}
