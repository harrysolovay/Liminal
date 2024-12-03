import type { ChatCompletion } from "openai/resources/chat/completions"
import type { Schema } from "../json/mod.ts"
import { assert } from "../util/mod.ts"

export function unwrapChoice(completion: ChatCompletion): string {
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

export function parseChoice(choice: string): Schema {
  const parsed = JSON.parse(choice)
  if ("__unsafe_structured_output" in parsed) {
    return parsed.__unsafe_structured_output
  }
  return parsed
}
