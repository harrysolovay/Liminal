import { OpenAIAdapter } from "liminal/openai"
import OpenAI from "openai"
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

await liminal.thread().next({
  type: Contact,
  inputs: [
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
