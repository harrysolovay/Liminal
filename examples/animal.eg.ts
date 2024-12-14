import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal } from "liminal"
import { OpenAIAdapter } from "../client/openai/mod.ts"
import { dbg } from "../util/dbg.ts"

const Dog = L.object({
  bark: L.string,
  favoriteToy: L.string,
})

const Elephant = L.object({
  troopId: L.number,
  remembersYourFace: L.boolean,
})

const Animal = L.TaggedUnion({
  Dog,
  Elephant,
  SlowLoris: null,
})

const liminal = new Liminal(OpenAIAdapter({
  openai: new OpenAI(),
  defaultModel: "gpt-4o-mini",
}))

await liminal.session().value(Animal).then(dbg("examples"))
