import OpenAI from "openai"
import "@std/dotenv/load"
import { DEFAULT_INSTRUCTIONS, L, OpenAIResponseFormat } from "liminal"
import { dbg } from "testing"
import { ColorHex } from "./color.eg.ts"

const Character = L.object({
  name: L.string,
  home: L.string`The name of a fictional realm of magic and wonder.`,
  disposition: L.enum("Optimistic", "Reserved", "Inquisitive"),
  age: L.number`Age of the character.`,
  friends: L.array(L.string)`Names of the character's friends.`,
  favoriteColor: ColorHex,
})

const response_format = OpenAIResponseFormat("animal", Character)

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
