import { assert } from "@std/assert"
import { encodeBase32 } from "@std/encoding"
import type OpenAI from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import { type Model, type Rune, schema as schema_, signature } from "../mod.ts"
import { WeakMemo } from "../util/WeakMemo.ts"

export function model(client: OpenAI, model: (string & {}) | ChatModel): Model {
  return {
    action: "Model",
    complete: async ({ messages }, rune) => {
      const response_format = rune.kind === "string" ? undefined : {
        type: "json_schema" as const,
        json_schema: {
          name: await nameMemo.getOrInit(rune),
          schema: schema_(rune),
          strict: true,
        },
      }
      const { choices, created } = await client.chat.completions.create({
        model,
        messages: messages.map(({ role, body }) => ({
          role: role === "reducer" ? "user" : role,
          content: [{
            type: "text",
            text: body,
          }],
        })),
        response_format,
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

const nameMemo = new WeakMemo<Rune, Promise<string>>(async (rune) => {
  const data = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(signature(rune)))
  return encodeBase32(data).slice(0, -4)
})
