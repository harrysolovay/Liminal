import "@std/dotenv/load"
import "@std/dotenv/load"
import { assert, L, Liminal, OllamaAdapter } from "liminal"

const $ = Liminal(OllamaAdapter({
  defaultModel: "llama3.2",
}))

const MathReasoning = L.object({
  steps: L.array(L.object({
    explanation: L.string,
    output: L.string,
  })),
  final_answer: L.string,
})

const reasoning = await $({
  role: "system",
  content: "You are a helpful math tutor. Guide the user through the solution step by step.",
}, "How can I solve 8x + 7 = -23?")(MathReasoning)

await assert(MathReasoning, reasoning)
