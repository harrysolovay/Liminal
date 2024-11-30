import Openai from "openai"
import "@std/dotenv/load"
import { ResponseFormat, T } from "structured-outputs"
import * as std from "structured-outputs/std"
import { dbg } from "../testing.ts"

const greeting = T.taggedUnion("greeting", {
  Hi: T.string,
  Yo: T.number,
  Hey: null,
})

const Character = T.object({
  name: T.string.refine({
    minLength: 4,
    maxLength: 30,
  }),
  home: T.string`The name of a fictional realm of magic and wonder.`,
  disposition: T.enum("Optimistic", "Reserved", "Inquisitive"),
  born: std.Date`Date the character was born. Make sure it aligns with the age.`,
  stateOfAffairs: T.tuple(
    T.string`Home life.`,
    T.string`Professional life.`,
    T.string`Health.`,
  )`How are things going for the character in these various domains?`,
  randomValue: T.union(T.string, T.number),
  friends: T.array(T.string)`Names of the character's friends.`,
  greeting,
  favoriteColor: std.colors.Hex,
})

const response_format = ResponseFormat("create_character", Character)`
  Create a new character to be the protagonist of a children's story.
`

await new Openai().chat.completions
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
