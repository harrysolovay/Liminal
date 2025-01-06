import { T } from "liminal"
import { model } from "liminal/openai"
import "@std/dotenv/load"
import OpenAI from "openai"

const Dog = T.object({
  name: T.string,
  ownerName: T.string,
  favoriteToy: T.string,
})

await Dog
  .value(model(new OpenAI(), "gpt-4o-mini"))
  .then(console.log)
