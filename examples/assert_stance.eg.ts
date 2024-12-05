import Openai from "openai"
import { AssertAdherence, refine, ResponseFormat, T, TokenAllowance } from "structured-outputs"
import "@std/dotenv/load"
import { dbg } from "../util/mod.ts"

const openai = new Openai()

const assertStance = AssertAdherence(openai)

const ReasonToBeHappy = T
  .string`A reason to be sad. Do not put a positive spin on it. One sentence.`
  .assert(assertStance, "This is a reason to be happy.")

const response_format = ResponseFormat("ReasonToBeHappy", ReasonToBeHappy)

const allowance = new TokenAllowance({
  total_tokens: 1_000,
})

await refine(openai, {
  model: "gpt-4o-mini",
  messages: [{ role: "system", content: [] }],
  response_format,
}, { allowance }).then(dbg)
