// import Openai from "openai"
// import { T } from "structured-outputs"
// import { ResponseFormat } from "structured-outputs/client"
// import "@std/dotenv/load"
// import { checked } from "structured-outputs/client"
// import { dbg } from "testing"

// const openai = new Openai()

// const _1To100Desc = T.number`A number between 1 and 100.`
// const Name = T.string.refine({
//   minLength: 3,
// })`A name between 1 and 50 characters in length.`

// const Refined = T.object({
//   a: _1To100Desc.refine({ min: 90 }),
//   b: T.object({
//     c: _1To100Desc.refine({ max: 10 }),
//   }),
//   v: T.taggedUnion("type", {
//     Dog: Name,
//     Cat: Name,
//   }),
// })

// const response_format = ResponseFormat("initially_invalid", Refined, false)

// await checked(openai, {
//   model: "gpt-4o-mini",
//   response_format,
//   messages: [{ role: "system", content: [] }],
// }).then(dbg)
