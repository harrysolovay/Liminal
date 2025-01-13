import { Thread, Type as T } from "liminal"
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

  const x = yield* Thread(child()).handle(function*(e) {
    return e
  })

  return yield* T.string
}

function* child() {
  yield 10
  yield "HELLO!"
  yield {
    IT_IS_BEAUTIFUL: true,
  }
  return yield* T.string
}

const result = Thread(
  model(new OpenAI(), "gpt-4o-mini"),
  PassagePoem(),
)`
  System message here.
`
