import Openai from "openai"
import "@std/dotenv/load"
import { OpenaiAdapter } from "../client/openai/mod.ts"
import { L, Session } from "../mod.ts"

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

const session = new Session(OpenaiAdapter(new Openai()))

const value = await session.value(Animal)

console.log(value)
