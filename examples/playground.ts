import { L, model } from "liminal"
import OpenAI from "openai"

const openai = new OpenAI()

const Animal = L.object({
  name: L.string,
  kind: L.string`Kind of animal`,
})

const g = L.thread(L.string, function*() {
  yield* model.openai(openai, "gpt-4o-mini")

  const owner = yield* L.string
  const animal = yield* Animal

  const summary = yield* L.string`Summarize our conversation.`
  yield* L.reduce(() => summary)
  yield* L.tool("Does something", () => {
    console.log("Hi!")
  })

  yield* L.event({
    type: "something",
    misc: true,
  })
  yield* h((v) => {
    v.something
  })

  // // const hValue = yield* h.handle(function*(v) {
  // //   console.log(v)
  // //   yield L.Event(v)
  // // })

  return "xyz"
})

const h = L.thread(L.string, function*() {
  yield* model.openai(openai, "gpt-4o-mini")
  const x = yield* L.string`Something`
  // yield L.Event({ sup: "hi" })
  const summary = yield* L.string`Summarize our conversation.`
  yield* L.reduce(() => summary)
  yield* L.event({
    something: "here",
  })
  return x
})
