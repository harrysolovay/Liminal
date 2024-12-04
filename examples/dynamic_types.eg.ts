import Openai from "openai"
import { ResponseFormat, T } from "structured-outputs"
import "@std/dotenv/load"
import { dbg } from "../util/mod.ts"

const openai = new Openai()

const response_format_0 = ResponseFormat(
  "story_data_schema",
  T.MetaType,
)`Generate a type definition for an object that contains information about a fictional story world.`

const dynType = await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: [] }],
    response_format: response_format_0,
  })
  .then(response_format_0.into)
  .then(dbg("MetaType"))

const response_format_1 = ResponseFormat("story_data", dynType)

await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: [] }],
    response_format: response_format_1,
  })
  .then(response_format_1.into)
  .then(dbg("Output"))
