import "@std/dotenv/load"
import { assert, L, Liminal, OllamaAdapter } from "liminal"

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

const animal = await $(Animal)

await assert(Animal, animal)
