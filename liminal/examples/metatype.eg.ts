import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal, OpenAIAdapter } from "../mod.ts"
import { dbg } from "../util/dbg.ts"

const liminal = new Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const session = liminal.session()

const World = await session.value(L.MetaType, {
  messages: [{
    role: "user",
    content: "What data type might describe the ontology of a magical story world?",
  }],
}).then(dbg("examples"))

await session.value(World).then(dbg("examples"))
