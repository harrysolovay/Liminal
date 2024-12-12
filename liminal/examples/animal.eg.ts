import Openai from "openai"
import "@std/dotenv/load"
import { L, OpenaiSessionConfig, Session } from "../mod.ts"

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

const Root = L.object({
  root: Animal,
})

const session = new Session(OpenaiSessionConfig(() => new Openai()))

const value = await session.value(Root, "gpt-4o-mini")

console.log(value)
