import OpenAI from "openai"
import "@std/dotenv/load"
import { L, OpenAIResponseFormat } from "liminal"
import { dbg } from "../util/mod.ts"

const MathReasoning = L.object({
  steps: L.array(L.object({
    explanation: L.string,
    output: L.string,
  })),
  final_answer: L.string,
})

const response_format = OpenAIResponseFormat("animal", MathReasoning)

await new OpenAI().chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: "You are a helpful math tutor. Guide the user through the solution step by step.",
    }, {
      role: "user",
      content: "How can I solve 8x + 7 = -23?",
    }],
    response_format,
  })
  .then(response_format.deserialize)
  .then(dbg)
