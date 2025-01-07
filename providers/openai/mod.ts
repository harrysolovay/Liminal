import { assert } from "@std/assert"
import type OpenAI from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import type { Model } from "../../mod.ts"

export function model(client: OpenAI, model: (string & {}) | ChatModel): Model {
  return {
    type: "Model",
    complete: async (messages, options) => {
      const { choices, created } = await client.chat.completions.create({
        model,
        messages: messages.map(({ role, body }) => ({
          role,
          content: [{
            type: "text",
            text: body,
          }],
        })),
        response_format: options?.schema
          ? {
            type: "json_schema",
            json_schema: {
              name: `lmnl_${options.signature}`,
              schema: options.schema,
              strict: true,
            },
          }
          : undefined,
      })
      const [choice0] = choices
      assert(choice0 !== undefined)
      const { message } = choice0
      assert(typeof message.content === "string")
      return {
        role: "assistant",
        body: message.content,
        created,
      }
    },
  }
}
