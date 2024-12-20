import "@std/dotenv/load"
import { L, Liminal, OllamaAdapter } from "liminal"
import { dbg } from "testing"

const $ = Liminal(OllamaAdapter({
  defaultModel: "llama3.2",
}))

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

const animal = await $(Animal).then(dbg)

await Animal.assert(animal)
