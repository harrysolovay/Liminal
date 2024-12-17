import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal } from "liminal"
import { OpenAIAdapter } from "liminal/openai"
import { dbg } from "testing"

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

await liminal.value(Animal).then(dbg)
