import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal, OpenAIAdapter } from "../mod.ts"
import { dbg } from "../util/dbg.ts"
import { ColorHex } from "./color.eg.ts"

const Character = L.object({
  name: L.string,
  home: L.string`The name of a fictional realm of magic and wonder.`,
  disposition: L.enum("Optimistic", "Reserved", "Inquisitive"),
  age: L.number`Age of the character.`,
  friends: L.array(L.string)`Names of the character's friends.`,
  favoriteColor: ColorHex,
})

const liminal = new Liminal(OpenAIAdapter({
  openai: new OpenAI(),
  defaultModel: "gpt-4o-mini",
}))

await liminal.session().value(Character).then(dbg())
