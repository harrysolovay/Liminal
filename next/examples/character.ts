import Openai from "openai"
import "@std/dotenv/load"
import { dbg } from "test_util"
import { ResponseFormat, T } from "../mod.ts"
import * as std from "../std_types/mod.ts"

const greeting = T.taggedUnion("greeting", {
  Hi: T.string,
  Ho: T.number,
  Hum: T.object({
    fee: T.number,
    fi: T.string,
  }),
  Sup: null,
})`Prefer variants other than Hi or Sup.`

const Character = T.object({
  name: T.string,
  age: T.number`Ensure between 1 and 110.`,
  home: T.string`The name of a fictional realm of magic and wonder.`,
  disposition: T.enum("Optimistic", "Reserved", "Inquisitive"),
  something: T.union(
    T.string,
    T.number,
    T.object({ a: T.string }),
  ),
  friends: T.array(T.string)`Names of the character's friends.`,
  description: T.tuple(
    T.string`Their home life.`,
    T.string`Their professional life.`,
    T.string`Their health.`,
  )`How are things going for the character in these various domains?`,
  greeting,
  maybe: T.option(T.string)`Is there a conflict in the story? Prefer none.`,
  born: std.Date`Date the character was born`,
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
