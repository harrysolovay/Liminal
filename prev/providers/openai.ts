import { assert } from "@std/assert"
import type OpenAI from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import type { Model } from "../mod.ts"

export function model(client: OpenAI, model: (string & {}) | ChatModel): Model {
  return {
    kind: "Model",
    async complete(messages, _type) {
      const { choices, created } = await client.chat.completions.create({
        model,
        messages: messages.map(({ role, body }) => ({
          role: role === "reducer" ? "user" : role,
          content: [{
            type: "text",
            text: body,
          }],
        })),
      })
      const [choice0] = choices
      assert(choice0 !== undefined)
      const { message } = choice0
      assert(typeof message.content === "string")
      return {
        role: "assistant",
        body: message.content,
        created: new Date(created * 1000),
      }
    },
  }
}