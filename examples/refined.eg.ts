import Openai from "openai"
import { T } from "structured-outputs"
import { ResponseFormat } from "structured-outputs/client"
import "@std/dotenv/load"
import { refined } from "structured-outputs/client"
import { dbg } from "testing"
import { asserts } from "../util/mod.ts"

const openai = new Openai()

const _1To100Desc = T.number`A number between 1 and 100.`
const Name = T.string.assert(
  asserts.string.maxLength,
  6,
)`A name between 1 and 20 characters in length.`

const Refined = T.object({
  a: _1To100Desc.assert(asserts.number.min, 90),
  b: T.object({
    c: _1To100Desc.assert(asserts.number.max, 10),
  }),
  v: T.taggedUnion("type", {
    Dog: Name,
    Cat: Name,
  }),
})

const response_format = ResponseFormat("initially_invalid", Refined)

await refined(openai, {
  model: "gpt-4o-mini",
  response_format,
  messages: [{ role: "system", content: [] }],
}).then(dbg)