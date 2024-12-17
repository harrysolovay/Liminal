import OpenAI from "openai"
import { OpenAIAdapter } from "../providers/OpenAI/mod.ts"
import "@std/dotenv/load"
import { L, Liminal } from "liminal"
import { dbg } from "testing"

const Contact = L.object({
  name: L.string,
  phone: L.number,
  email: L.string,
})

const liminal = new Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

await liminal.value(Contact, {
  messages: [
    {
      role: "system",
      content: "Extract contact data from the supplied message.",
    },
    {
      role: "user",
      content: "Please call John Doe at 555-123-4567 or email him at john.doe@example.com.",
    },
  ],
}).then(dbg)
