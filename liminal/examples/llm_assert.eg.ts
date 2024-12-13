import OpenAI from "openai"
import "@std/dotenv/load"
import { OpenAIAdapter } from "../client/openai/mod.ts"
import { L, Liminal } from "../mod.ts"

const Contradiction = L.string`A reason to be sad.`(
  L.assert("Is a reason to be happy.")(),
)

const liminal = new Liminal(OpenAIAdapter({
  openai: new OpenAI(),
  defaultModel: "gpt-4o-mini",
}))

const session = await liminal.session()

const value = await session.value(Contradiction)

console.log(value)
