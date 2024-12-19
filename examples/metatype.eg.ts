import OpenAI from "openai"
import "@std/dotenv/load"
import { Liminal, MetaType } from "liminal"
import { OpenAIAdapter } from "liminal/openai"
import { dbg } from "testing"

const $ = Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

$`What data type might describe the ontology of a magical story world?`
const World = await $(MetaType).then(dbg)

$`Generate the story world's data.`
await $(World).then(dbg)
