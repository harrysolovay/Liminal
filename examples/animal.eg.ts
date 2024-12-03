import Openai from "openai"
import { ResponseFormat, T } from "structured-outputs"
import "@std/dotenv/load"
import { dbg } from "testing"

const Dog = T.object({
  bark: T.string,
  favoriteToy: T.string,
})

const Elephant = T.object({
  troopId: T.number,
  remembersYourFace: T.boolean,
})

const SlowLoris = T.object({
  poisonousElbows: T.boolean,
  cuteAsCouldBe: T.boolean,
})

export const Animal = T.taggedUnion("type", {
  Dog,
  Elephant,
  SlowLoris,
})

const openai = new Openai()

const response_format = ResponseFormat("generate_animal", Animal)

await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: [] }],
    response_format,
  })
  .then(response_format.into)
  .then(dbg)
