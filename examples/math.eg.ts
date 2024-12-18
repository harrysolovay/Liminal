import OpenAI from "openai"
import "@std/dotenv/load"
import { dbg } from "testing"
import "@std/dotenv/load"
import { L, Liminal } from "liminal"
import { OpenAIAdapter } from "liminal/openai"

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

await liminal.thread().next({
  type: MathReasoning,
  inputs: [
    {
      role: "system",
      content: "You are a helpful math tutor. Guide the user through the solution step by step.",
    },
    {
      role: "user",
      content: "How can I solve 8x + 7 = -23?",
    },
  ],
}).then(dbg)
