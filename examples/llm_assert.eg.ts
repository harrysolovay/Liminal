import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal } from "liminal"
import { OpenAIAdapter } from "liminal/openai"
import { dbg } from "testing"

const $ = Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const Contradiction = L.string`A reason to be sad.`(
  L.Assertion("Is a reason to be happy."),
)

await $(Contradiction).then(dbg)
