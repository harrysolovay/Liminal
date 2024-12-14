import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal, OpenAIAdapter } from "../mod.ts"
import { dbg } from "../util/dbg.ts"

const Contact = L.object({
  name: L.string,
  phone: L.number,
  email: L.string,
})

const liminal = new Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

await liminal.session().value(Contact, {
  messages: [{
    role: "user",
    content: `
      Extract data from the following message:

      \`\`\`
      Please call John Doe at 555-123-4567 or email him at john.doe@example.com.
      \`\`\`
    `,
  }],
}).then(dbg())
