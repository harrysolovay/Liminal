import Openai from "openai"
import {
  AssertAdherence,
  refined,
  ResponseFormat,
  T,
  TokenAllowanceManager,
} from "structured-outputs"
import "@std/dotenv/load"
import { dbg } from "../util/mod.ts"

const openai = new Openai()

const assertStance = AssertAdherence(openai)

const ReasonToBeHappy = T
  .string`A reason to be sad. Do not put a positive spin on it. One sentence.`
  .assert(assertStance, "This is a reason to be happy.")

const response_format = ResponseFormat("ReasonToBeHappy", ReasonToBeHappy)

const allowance = new TokenAllowanceManager({
  total_tokens: 1_000,
})

await refined(openai, {
  model: "gpt-4o-mini",
  messages: [{ role: "system", content: [] }],
  response_format,
}, { allowance }).then(dbg)
