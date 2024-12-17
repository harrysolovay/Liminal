import OpenAI from "openai"
import "@std/dotenv/load"
import { L, Liminal } from "liminal"
import { OpenAIAdapter } from "liminal/openai"
import { dbg } from "testing"

const Character = L.object({
  name: L.string,
  home: L.string`The name of a fictional realm of magic and wonder.`,
  disposition: L.enum("Optimistic", "Reserved", "Inquisitive"),
  age: L.number`Age of the character.`,
  friends: L.array(L.string)`Names of the character's friends.`,
})

const liminal = new Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

await liminal.value(Character).then(dbg)
