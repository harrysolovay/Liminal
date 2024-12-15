import OpenAI from "openai"
import "@std/dotenv/load"
import { L, OpenAIResponseFormat } from "liminal"
import { dbg } from "testing"

const Contact = L.object({
  name: L.string,
  phone: L.number,
  email: L.string,
})

const response_format = OpenAIResponseFormat("contact", Contact)

await new OpenAI().chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: "Extract contact data from the supplied message.",
    }, {
      role: "user",
      content: "Please call John Doe at 555-123-4567 or email him at john.doe@example.com.",
    }],
    response_format,
  })
  .then(response_format.deserialize)
  .then(dbg)
