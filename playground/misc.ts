import OpenAI from "openai"
import { L } from "../mod.ts"
import { model } from "../providers/openai.ts"

const Animal = L.object({
  name: L.string,
  kind: L.string`Kind of animal`,
})

const g = L.thread(function*() {
  yield model(new OpenAI(), "gpt-4o-mini")

  const owner = yield* L.string
  const animal = yield* Animal

  const summary = yield* L.string`Summarize our conversation.`
  yield* L.reduce(() => summary)
  yield* L.tool("Does something", () => {
    console.log("Hi!")
  })

  yield L.event({
    type: "something",
    misc: true,
  })
  yield* h.handle((v) => {
    v.something
  })

  // // const hValue = yield* h.handle(function*(v) {
  // //   console.log(v)
  // //   yield L.Event(v)
  // // })

  return "xyz"
}, L.string)

const h = L.thread(function*() {
  const x = yield* L.string`Something`
  // yield L.Event({ sup: "hi" })
  const summary = yield* L.string`Summarize our conversation.`
  yield* L.reduce(() => summary)
  yield L.event({
    something: "here",
  })
  return x
}, L.string)
