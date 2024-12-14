import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal, OpenAIAdapter } from "../mod.ts"
import { dbg } from "../util/dbg.ts"

const MathReasoning = L.object({
  steps: L.array(L.object({
    explanation: L.string,
    output: L.string,
  })),
  final_answer: L.string,
})

const liminal = new Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const session = liminal.session([{
  role: "system",
  content: "You are a helpful math tutor. Guide the user through the solution step by step.",
}])

await session.value(MathReasoning, {
  messages: [{
    role: "user",
    content: "How can I solve 8x + 7 = -23?",
  }],
}).then(dbg("examples"))
