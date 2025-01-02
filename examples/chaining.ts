import { L, model } from "liminal"
import OpenAI from "openai"
import { dbg } from "testing"

const openai = new OpenAI()

const TEXT = "Lorem ipsum dolor."

const poem = L.thread(L.string, function*() {
  yield* model.openai(openai, "gpt-4o-mini")

  yield `Summarize the following text: "${TEXT}"`
  yield `Write a poem based on the following text: "${yield* L.string}"`
})

await L.run(poem).then(dbg)
