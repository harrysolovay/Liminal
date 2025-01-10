import { L, Thread } from "liminal"
import { model } from "liminal/openai"
import OpenAI from "openai"

const text = await Deno.readTextFile(new URL("dracula.txt", import.meta.url))
const SAMPLE_LENGTH = 1000

function* PassagePoem() {
  yield "Summarize the following passage from Bram Stoker's Dracula."

  const start = Math.floor(Math.random() * (text.length - SAMPLE_LENGTH + 1))
  yield text.slice(start, start + SAMPLE_LENGTH)

  yield {
    something: "here",
  }

  yield {
    another: "here",
  }

  yield true && {
    test: "yo",
  }

  yield "Use the summary to create a poem."

  return yield* L.string
}

const x = await Thread(
  model(new OpenAI(), "gpt-4o-mini"),
  "",
  PassagePoem(),
  L.object({ a: L.string }),
).exec()
