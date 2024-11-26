import Openai from "openai"
import "@std/dotenv/load"
import { ResponseFormat, T } from "structured-outputs"
import { dbg } from "test_util"

export const Sex = T.constantUnion("Male", "Female")`The biological sex of the character.`

const Character = T.object({
  name: T.string,
  age: T.number`Ensure between 1 and 110.`,
  home: T.string`The name of a fictional realm of magic and wonder.`,
  disposition: T.constantUnion("Optimistic", "Reserved", "Inquisitive"),
  dob: T.Date`Prehistoric $`,
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
