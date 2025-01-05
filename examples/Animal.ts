import { L } from "liminal"
import { model } from "liminal/openai"
import "@std/dotenv/load"
import OpenAI from "openai"

const Dog = L.object({
  name: L.string,
  ownerName: L.string,
  favoriteToy: L.string,
})

await Dog
  .run(model(new OpenAI(), "gpt-4o-mini"))
  .then(console.log)
