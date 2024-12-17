import OpenAI from "openai"
import "@std/dotenv/load"
import { Liminal } from "liminal"
import { dbg } from "testing"
import { MetaType } from "../json_schema/mod.ts"
import { OpenAIAdapter } from "../providers/OpenAI/mod.ts"

const liminal = new Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const World = await liminal.value(MetaType, {
  messages: [{
    role: "user",
    content: "What data type might describe the ontology of a magical story world?",
  }],
}).then(dbg)

await liminal.value(World).then(dbg)
