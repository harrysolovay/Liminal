import type { Ollama } from "ollama"
import { type Model, normalizeMessageLike } from "../mod.ts"

export function model(client: Ollama, model: string): Model {
  return {
    type: "Model",
    complete: async (messages, options) => {
      if (options && !messages.length) {
        messages = normalizeMessageLike("Provide a value of the specified type.")
      }
      const { created_at, message } = await client.chat({
        model,
        messages: messages.map(({ role, body }) => ({
          role,
          content: body,
        })),
        format: options?.schema,
        stream: false,
      })
      return {
        role: "assistant",
        body: message.content,
        created: Math.floor(new Date(created_at).getTime() / 1000),
      }
    },
  }
}
