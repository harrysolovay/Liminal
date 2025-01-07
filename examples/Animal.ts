import { T } from "liminal"
import { model } from "../providers/openai.ts"
import "@std/dotenv/load"
import OpenAI from "openai"

const Dog = T.object({
  name: T.string,
  ownerName: T.string,
  favoriteToy: T.string,
  something: T.const(T.string, "HI!"),
})

await Dog
  .value(model(new OpenAI(), "gpt-4o-mini"))
  .then(console.log)
