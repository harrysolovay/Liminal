import Openai from "openai"
import { ResponseFormat, T } from "structured-outputs"
import "@std/dotenv/load"
import { dbg } from "../util/mod.ts"

const Dog = T.object({
  bark: T.string,
  favoriteToy: T.string,
})`Some description of ${"nationality"} dog.`

const Elephant = T.object({
  troopId: T.number,
  remembersYourFace: T.boolean,
})`Some description of ${"nationality"} elephant.`

const SlowLoris = T.object({
  poisonousElbows: T.boolean,
  cuteAsCouldBe: T.boolean,
})`Some description of ${"nationality"} slow loris.`

export const Animal = T.taggedUnion("type", {
  Dog,
  Elephant,
  SlowLoris,
})

const openai = new Openai()

const response_format = ResponseFormat(
  "generate_animal",
  Animal.fill({
    nationality: "American",
  }),
)

await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: [] }],
    response_format,
  })
  .then(response_format.into)
  .then(dbg)
