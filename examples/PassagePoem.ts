import { event, relay, T, Thread } from "liminal"
import { model } from "liminal/openai"
import "@std/dotenv/load"
import OpenAI from "openai"

const dracula = await Deno.readTextFile(new URL("dracula.txt", import.meta.url))
const SAMPLE_LENGTH = 1000

const PassagePoem = Thread(function*() {
  yield* relay(console.log)

  yield "Summarize the following passage from Bram Stoker's Dracula."

  yield* ChildThread.handle(console.log)

  const start = Math.floor(Math.random() * (dracula.length - SAMPLE_LENGTH + 1))
  yield dracula.slice(start, start + SAMPLE_LENGTH)

  yield* T.string

  yield "Use the summary to create a poem."

  return yield* T.string
})

const ChildThread = Thread(function*() {
  yield event({ A: "Hello" })
  yield event({ B: "How are you?" })
  yield event({ C: "Decent I hope?" })
})

await PassagePoem.run(model(new OpenAI(), "gpt-4o-mini")).then(console.log)
