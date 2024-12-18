import OpenAI from "openai"
import "@std/dotenv/load"
import { Liminal } from "liminal"
import { OpenAIAdapter } from "liminal/openai"
import { dbg } from "testing"
import { MetaType } from "../json_schema/mod.ts"

const liminal = new Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const thread = liminal.thread()

const World = await thread.enqueue({
  type: MetaType,
  inputs: [{
    role: "user",
    content: "What data type might describe the ontology of a magical story world?",
  }],
}).then(dbg)

await thread.enqueue({ type: World }).then(dbg)
