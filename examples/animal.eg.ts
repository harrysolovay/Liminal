import Openai from "openai"
import { ResponseFormat, T } from "structured-outputs"
import "@std/dotenv/load"
import { dbg } from "testing"
import { deserializeJsonValue } from "../json_schema/mod.ts"

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

const Root = T.object({ animal: Animal })

const openai = new Openai()

const response_format = ResponseFormat("generate_animal", Root)

const choice = await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: [] }],
    response_format,
  })
  .then(ResponseFormat.unwrapChoice)
  .then(dbg)
const parsed = JSON.parse(choice)
console.log(deserializeJsonValue(Root, parsed))
