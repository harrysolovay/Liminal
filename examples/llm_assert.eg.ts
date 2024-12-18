import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal } from "liminal"
import { OpenAIAdapter } from "liminal/openai"
import { dbg } from "testing"

const Contradiction = L.string`A reason to be sad.`(
  L.Assertion("Is a reason to be happy."),
)

const liminal = new Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

await liminal.thread().enqueue({ type: Contradiction }).then(dbg)
