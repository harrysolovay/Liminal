import { ResponseFormat, T } from "../mod.ts"
import "@std/dotenv/load"
import Openai from "openai"

export const Sex = T.constantUnion("Male", "Female")`The biological sex of the character.`

export const Main = T.struct({
  name: T.str`"Name of the character`,
  background: T.str`Background of the character.`,
})`The details pertinent to the main character.`

export const Anonymous = T.struct({
  disposition: T.str`Disposition of the character.`,
  focusReason: T.str`Reason the character has temporarily entered the scene.`,
})`The details of a character who makes a brief appearance.`

export const Details = T.taggedUnion({ Main, Anonymous })`Details which vary by character type.`

export const Age = T.num`The age of the character.`

export const Character = T.struct({
  age: Age,
  sex: Sex,
  details: Details,
})`A character in a story.`

const openai = new Openai({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
})

const response_format = ResponseFormat("create_character", Character)`
  Create a new character to be the protagonist of a children's story.
`

const character = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{
    role: "system",
    content: [],
  }],
  response_format,
}).then(response_format.parseFirstOrThrow)

console.log(character)
