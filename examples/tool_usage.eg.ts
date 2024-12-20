import "@std/dotenv/load"
import { L, Liminal, OllamaAdapter } from "liminal"
import { weather } from "./tools/mod.ts"

const $ = Liminal(OllamaAdapter({
  defaultModel: "llama3.2",
}))

const result = await $`Describe the weather in New York City?`(L.string, {
  tools: { weather },
})

await L
  .string(L.assert`is a description of the weather in New York City.`)
  .assert(result)
