import { L } from "../../mod.ts"
import { OpenAIAdapter } from "./OllamaAdapter.ts"

const adapter = OpenAIAdapter({
  endpoint: "http://localhost:11434/api/chat",
  defaultModel: "llama3.2",
})

console.log(
  await adapter.complete({
    messages: [{
      role: "user",
      content:
        "Ollama is 22 years old and busy saving the world. Return a JSON object with the age and availability.",
    }],
    type: L.object({
      age: L.string,
      available: L.boolean,
    }),
  }),
)
