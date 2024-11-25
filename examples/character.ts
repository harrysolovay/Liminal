import { ResponseFormat, T } from "structured-outputs"
import { dbg, openai } from "./_common.ts"

export const Sex = T.constantUnion("Male", "Female")`The biological sex of the character.`

const Character = T.object({
  name: T.string,
  age: T.number`Ensure between 1 and 110.`,
  home: T.string`The name of a fictional realm of magic and wonder.`,
  disposition: T.constantUnion("Optimistic", "Reserved", "Inquisitive"),
})

const response_format = ResponseFormat("create_character", Character)`
  Create a new character to be the protagonist of a children's story.
`

const character = await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    response_format,
    messages: [{
      role: "system",
      content: [],
    }],
  })
  .then(response_format.parseFirstChoice)
  .then(dbg)

console.log(character)
