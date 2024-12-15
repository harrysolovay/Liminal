// @egts
// unstable: `Liminal` and `OpenAIAdapter` are WIP (and therefore not exposed as root exports).

import OpenAI from "openai"
import "@std/dotenv/load"
import { L } from "liminal"
import { Liminal } from "../client/Liminal.ts"
import { OpenAIAdapter } from "../client/openai/OpenAIAdapter.ts"
import { dbg } from "../util/mod.ts"

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
