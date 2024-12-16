import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal } from "liminal"
import { OpenAIAdapter } from "liminal/openai"
import { dbg } from "testing"

const liminal = new Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const session = liminal.session()

const World = await session.value(L.MetaType, {
  messages: [{
    role: "user",
    content: "What data type might describe the ontology of a magical story world?",
  }],
}).then(dbg)

await session.value(World).then(dbg)
