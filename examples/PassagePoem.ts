import { relay, T, Thread } from "liminal"
import { model } from "liminal/openai"
import "@std/dotenv/load"
import OpenAI from "openai"

Thread(function*() {
  yield* relay(console.log)

  yield "Summarize the following passage from Bram Stoker's Dracula."

  yield sample()

  yield* T.string

  yield "Use the summary to create a poem."

  return yield* T.string
})
  .run(model(new OpenAI(), "gpt-4o-mini"))
  .then(console.log)

function sample(): string {
  const start = Math.floor(Math.random() * (text.length - SAMPLE_LENGTH + 1))
  return text.slice(start, start + SAMPLE_LENGTH)
}

const text = await Deno.readTextFile(new URL("dracula.txt", import.meta.url))
const SAMPLE_LENGTH = 1000
