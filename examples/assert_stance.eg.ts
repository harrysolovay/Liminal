import Openai from "openai"
import { AssertStance, refined, ResponseFormat, T } from "structured-outputs"
import "@std/dotenv/load"
import { dbg } from "testing"

const openai = new Openai()

const assertStance = AssertStance(openai)

const ReasonToBeHappy = T
  .string`A reason to be sad. Do not put a positive spin on it. One sentence.`
  .assert(assertStance, "Turn this into a reason to be happy!")

const response_format = ResponseFormat("ReasonToBeHappy", ReasonToBeHappy)

await refined(openai, {
  model: "gpt-4o-mini",
  messages: [{ role: "system", content: [] }],
  response_format,
}, {
  maxRefinements: 2,
}).then(dbg)
