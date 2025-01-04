import { L } from "liminal"
import { model } from "liminal/openai"
import OpenAI from "openai"
import { Root } from "./Root.ts"

await L.thread(function*() {
  // Add the entered prompt reply into context.
  yield `User query: ${prompt("What can I assist you with?")!}`

  // Declare that we are about to describe the router.
  yield `We'll be routing the user query using the following router.`

  // Yield the router's signature (including descriptions).
  yield Root.signature()

  // Loop through clarification request until appropriate routing is clear to the LLM.
  while (true) {
    yield "Do we need any additional clarification in order to appropriately route the user query?"
    const request = yield* L.Option(L.string`The request for clarification.`)
    if (!request) {
      break
    }
    yield prompt(request)
  }

  // Delegate to the router thread, which inherits the current context and can therefore select
  // the appropriate route.
  yield* Root
}).run(model(new OpenAI(), "gpt-4o-mini"))
