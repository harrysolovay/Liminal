import { OpenAIAdapter } from "liminal/openai"
import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal } from "liminal"
import { dbg } from "testing"

const $ = Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const Contact = L.object({
  name: L.string,
  phone: L.number,
  email: L.string,
})

$({
  role: "system",
  content: "Extract contact data from the supplied message.",
}, "Please call John Doe at 555-123-4567 or email him at john.doe@example.com.")

await $(Contact).then(dbg)
