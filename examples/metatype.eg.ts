import OpenAI from "openai"
import "@std/dotenv/load"
import { assert, Liminal, MetaType, OpenAIAdapter } from "liminal"

const $ = Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

$`Declare a type that describes the ontology of a magical story world.`
const World = await $(MetaType)

$`Generate the story world's data.`
const world = await $(World)

// @egts:cut-start
await assert(MetaType, World)
await assert(World, world)
// @egts:cut-end
