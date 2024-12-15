import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal, OpenAIAdapter } from "liminal"
import { dbg } from "../util/mod.ts"

const liminal = new Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const session = liminal.session()

const World = await session.value(L.ObjectMetaType, {
  messages: [{
    role: "user",
    content: "What data type might describe the ontology of a magical story world?",
  }],
})

await session.value(World).then(dbg)
