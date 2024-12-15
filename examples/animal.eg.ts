import OpenAI from "openai"
import "@std/dotenv/load"
import { DEFAULT_INSTRUCTIONS, L, OpenAIResponseFormat } from "liminal"
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

const response_format = OpenAIResponseFormat("animal", Animal)

await new OpenAI().chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: DEFAULT_INSTRUCTIONS,
    }],
    response_format,
  })
  .then(response_format.deserialize)
  .then(dbg)
