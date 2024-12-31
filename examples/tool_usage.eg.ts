import "@std/dotenv/load"
import { assertValueType, L, Liminal, OllamaAdapter } from "liminal"
import { Ollama } from "ollama"

const $ = Liminal(OllamaAdapter({
  ollama: new Ollama(),
  defaultModel: "llama3.2",
}))

const result = await $`Describe the weather in New York City?`.value(L.string)

assertValueType(
  result,
  L.string(L.assert`is a description of the weather in New York City.`),
)
