import { L } from "liminal"
import { model } from "liminal/openai"
import OpenAI from "openai"

const TEXT = "Lorem ipsum dolor."

await L
  .thread(async function*() {
    yield L.content("image/png", "", "A description of the image")
    yield `Summarize the following text: "${TEXT}"`
    yield `Write a poem based on the following text: "${yield* L.string}"`
    console.log(yield* L.string)
  })
  .run(model(new OpenAI(), "gpt-4o-mini"))
