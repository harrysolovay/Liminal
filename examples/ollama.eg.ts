import "@std/dotenv/load"
import { L, Liminal } from "liminal"
import { OllamaAdapter } from "liminal/ollama"
import { dbg } from "testing"

const $ = Liminal(OllamaAdapter({
  defaultModel: "llama3.2",
}))

$`Ollama is 22 years old and busy saving the world. Return a JSON object with the age and availability.`

await $(L.object({
  age: L.number,
  available: L.boolean,
})).then(dbg)
