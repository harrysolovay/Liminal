import { L, Relayer } from "liminal"
import { model } from "liminal/openai"
import "@std/dotenv/load"
import OpenAI from "openai"
import { Animal } from "./Animal.ts"

const text = await Deno.readTextFile(new URL("dracula.txt", import.meta.url))
const SAMPLE_LENGTH = 1000

const PassagePoem = L.thread(
  function*() {
    yield model(new OpenAI(), "gpt-4o-mini")
    yield* Relayer((message) => console.log(message))

    yield "Summarize the following passage from Bram Stoker's Dracula."

    const start = Math.floor(Math.random() * (text.length - SAMPLE_LENGTH + 1))
    yield text.slice(start, start + SAMPLE_LENGTH)

    yield* L.string

    yield "Use the summary to create a poem."

    yield "Now make a value that matches the specified response format."

    const value = yield* Animal
    console.log(value)
  },
  L.string,
)

console.log(await PassagePoem.run())
