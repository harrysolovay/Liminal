import { Thread, Type as T } from "liminal"
import { model } from "liminal/openai"
import OpenAI from "openai"

const Animal = T.object({
  name: T.string`The name of the animal.`,
  noise: T.string`The noise the animal makes.`,
  large: T.boolean`Is it a large animal?`,
})

const openai = new OpenAI()

// const messages = [{
//   role: "user",
//   content: "Generate a value of the supplied schema.",
// }]

// const completion = await openai.chat.completions.create({
//   model: "gpt-4o-mini",
//   messages,
//   response_format: {
//     json_schema: {
//       name: "",
//       strict: true,
//       schema: {
//         type: "object",
//         properties: {
//           name: {
//             type: "string",
//             description: "",
//           },
//         },
//         required: ["name", "noise", "large"],
//         additionalProperties: false,
//       },
//     },
//   },
// })
// const [choice] = completion.choices
// if (choice) {
//   const { content } = choice.message
//   messages.push(choice.message)
//   if (typeof content === "string") {
//     const value = JSON.parse(content)
//   }
// }

function* SummaryPoem(text: string) {
  yield model(openai, "gpt-3.5-turbo")
  yield "Summarize the following text"
  yield text
  yield* T.string
  yield "Create a poem from that summary."
  const response = yield* T.array(T.string)
  const g = yield* Thread(SomethingElseToBeExplored())
  const animal = yield* Animal
  return yield* T.string
}

function* SomethingElseToBeExplored() {
  yield "Is it kind?"
  yield 2
  return ""
}
