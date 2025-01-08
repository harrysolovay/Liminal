import { Bubble, L, Relay, Thread } from "liminal"
import { model } from "liminal/openai"
import "@std/dotenv/load"
import OpenAI from "openai"

const text = await Deno.readTextFile(new URL("dracula.txt", import.meta.url))
const SAMPLE_LENGTH = 1000

await Thread(async function*() {
  yield model(new OpenAI(), "gpt-4o-mini")

  yield* Relay(console.log)

  yield "Summarize the following passage from Bram Stoker's Dracula."

  const start = Math.floor(Math.random() * (text.length - SAMPLE_LENGTH + 1))
  yield text.slice(start, start + SAMPLE_LENGTH)

  yield* L.string

  yield "Use the summary to create a poem."

  yield Bubble({ something: "" })

  return yield* L.string
}).run().then(console.log)
