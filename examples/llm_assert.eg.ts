import OpenAI from "openai"
import "@std/dotenv/load"
import { DEFAULT_INSTRUCTIONS, L, OpenAIResponseFormat } from "liminal"
import { dbg } from "../util/mod.ts"

const Contradiction = L.string`A reason to be sad.`(
  L.assert("Is a reason to be happy.")(),
)

const response_format = OpenAIResponseFormat("contradiction", Contradiction)

await new OpenAI().chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: DEFAULT_INSTRUCTIONS,
    }],
    response_format,
  })
  .then(response_format.deserialize)
  .then(dbg)
