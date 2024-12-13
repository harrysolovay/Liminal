import OpenAI from "openai"
import "@std/dotenv/load"
import { OpenAIAdapter } from "../client/openai/mod.ts"
import { L, Liminal } from "../mod.ts"

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
}))

const value = await liminal.value({
  name: "some_name",
  type: Animal,
})

console.log(value)
