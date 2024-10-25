import type Openai from "openai"

export function logCompletion({ usage, choices: [firstChoice] }: Openai.Chat.Completions.ChatCompletion) {
  const { finish_reason, message } = firstChoice!
  console.log(JSON.stringify({ usage, finish_reason, content: message.content }, null, 2))
}
