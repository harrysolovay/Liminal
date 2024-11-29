import Openai from "openai"
import { ResponseFormat, T } from "structured-outputs"
import "@std/dotenv/load"
import { checked } from "structured-outputs/client"
import { dbg } from "test_util"

const openai = new Openai()

const response_format = ResponseFormat(
  "initially invalid",
  T.object({
    value: T.number.refine({ max: 10 })`A number between 1 and 100.`,
  }),
)

await checked(openai, {
  model: "gpt-4o-mini",
  response_format,
  messages: [],
}).then(dbg)
