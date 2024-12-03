import Openai from "openai"
import { ResponseFormat, T } from "structured-outputs"
import "@std/dotenv/load"
import { dbg } from "testing"

const openai = new Openai()

const typeDefRf = ResponseFormat(
  "story_data_schema",
  T.TypeDef,
)`Generate a type definition for an object that contains information about a fictional story world.`

const def = await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: [] }],
    response_format: typeDefRf,
  })
  .then(typeDefRf.into)
  .then(dbg)

const instanceRf = ResponseFormat(
  "story_data_schema",
  T.hydrateType(def),
)`Generate a type definition for an object that contains information about a fictional story world.`

await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: [] }],
    response_format: instanceRf,
  })
  .then(typeDefRf.into)
  .then(dbg)
