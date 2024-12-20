import "@std/dotenv/load"
import { assert, L, Liminal, OllamaAdapter } from "liminal"

const $ = Liminal(OllamaAdapter({
  defaultModel: "llama3.2",
}))

$`Ollama is 22 years old and busy saving the world. Return a JSON object with the age and availability.`

const T = L.object({
  age: L.number,
  available: L.boolean,
})

const t = await $(T)
await assert(T, t)
