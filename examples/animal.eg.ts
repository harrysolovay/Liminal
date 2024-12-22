import "@std/dotenv/load"
import { L, Liminal, OllamaAdapter } from "liminal"
import { Ollama } from "ollama"
import { dbg } from "testing"

const $ = Liminal(OllamaAdapter({
  ollama: new Ollama(),
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

const animal = await $.send(Animal).then(dbg)

await Animal.assert(animal)
