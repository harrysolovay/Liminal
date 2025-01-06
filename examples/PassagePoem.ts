import { relay, T, Thread } from "liminal"
import { model } from "liminal/openai"
import "@std/dotenv/load"
import OpenAI from "openai"

const dracula = await Deno.readTextFile(new URL("dracula.txt", import.meta.url))
const SAMPLE_LENGTH = 1000

const PassagePoem = Thread(function*() {
  yield relay(console.log)

  yield "Summarize the following passage from Bram Stoker's Dracula."

  const start = Math.floor(Math.random() * (dracula.length - SAMPLE_LENGTH + 1))
  yield dracula.slice(start, start + SAMPLE_LENGTH)

  yield* T.string

  yield "Use the summary to create a poem."

  return yield* T.string
})

await PassagePoem
  .run(model(new OpenAI(), "gpt-4o-mini"))
  .then(console.log)
