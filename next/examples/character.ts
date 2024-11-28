import Openai from "openai"
import "@std/dotenv/load"
import { dbg } from "test_util"
import { ResponseFormat, T } from "../mod.ts"

const Character = T.object({
  name: T.string,
  age: T.number`Ensure between 1 and 110.`,
  home: T.string`The name of a fictional realm of magic and wonder.`,
})

const response_format = ResponseFormat("create_character", Character)`
  Create a new character to be the protagonist of a children's story.
`

const character = await new Openai().chat.completions
  .create({
    model: "gpt-4o-mini",
    response_format,
    messages: [{
      role: "system",
      content: [],
    }],
  })
  .then(response_format.into)
  .then(dbg)

console.log(character)
