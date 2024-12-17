export {}

// import { assert } from "@std/assert"
// import type Openai from "openai"
// import type {
//   ChatCompletionCreateParamsNonStreaming,
//   ChatCompletionMessageParam,
// } from "openai/resources/chat/completions"
// import { deserialize, Diagnostic, T, type Type } from "../../../core/mod.ts"
// import { tap } from "../../../util/mod.ts"
// import { parseChoice, unwrapChoice } from "./oai_util.ts"
// import { Prompt } from "./Prompt.ts"
// import { ResponseFormat } from "./ResponseFormat.ts"
// import type { TokenAllowance } from "./TokenAllowance.ts"

// export interface RefineParams<T = any> extends
//   Omit<
//     ChatCompletionCreateParamsNonStreaming,
//     "audio" | "modalities" | "response_format" | "stream" | "stream_options"
//   >
// {
//   response_format: ResponseFormat<T>
// }

// export interface RefineOptions {
//   signal?: AbortSignal
//   max?: number
//   allowance?: TokenAllowance
// }

// /** Get the completion and then loop refinement assertions and resubmission until all assertions pass. */
// export async function refine<T>(
//   client: Openai,
//   params: RefineParams<T>,
//   options?: RefineOptions,
// ): Promise<T> {
//   const { signal, max, allowance } = options ?? {}
//   assert(
//     max === undefined || (max >= 1 && Number.isInteger(max)),
//     "`CheckedOptions.maxRefinements` must be an integer greater than 1.",
//   )
//   const completion = await client.chat.completions
//     .create(params)
//     .then(tap(allowance?.ingest))
//   let diagnosticsPending: Array<Promise<Diagnostic | undefined>> = []
//   const content = unwrapChoice(completion)
//   const messages: ChatCompletionMessageParam[] = [...params.messages, {
//     role: "assistant",
//     content,
//   }]
//   const root = deserialize(
//     params.response_format[""],
//     parseChoice(content),
//     diagnosticsPending,
//   )
//   let correctionsRemaining = max ?? Infinity
//   let initialCorrection = true
//   while (
//     correctionsRemaining-- && !signal?.aborted && !allowance?.stop
//     && diagnosticsPending.length
//   ) {
//     const diagnostics = await Promise
//       .all(diagnosticsPending)
//       .then((v) => v.filter((v) => v !== undefined))
//     diagnosticsPending = []
//     if (!diagnostics.length) {
//       break
//     }
//     const CurrentCorrections = Corrections(diagnostics)
//     const response_format = ResponseFormat("corrections", CurrentCorrections)
//     messages.push({
//       role: "user",
//       content: initialCorrection
//         ? prompt(params, diagnostics)
//         : diagnostics.map(Diagnostic.toString).join("\n\n"),
//     })
//     initialCorrection = false
//     messages.forEach((message) => console.log(message.content))
//     const correctionsCompletion = await client.chat.completions.create({
//       ...params,
//       messages,
//       response_format,
//     }).then(tap(allowance?.ingest))
//     const choice = unwrapChoice(correctionsCompletion)
//     messages.push({
//       role: "assistant",
//       content: choice,
//     })
//     const corrections = deserialize(CurrentCorrections, parseChoice(choice))
//     while (diagnostics.length) {
//       const { setValue, valuePath, type } = diagnostics.shift()!
//       setValue(
//         deserialize(
//           type as never,
//           corrections[valuePath],
//           (!correctionsRemaining || (signal && signal.aborted)) ? undefined : diagnosticsPending,
//         ),
//       )
//     }
//   }
//   return root
// }

// function Corrections(diagnostics: Array<Diagnostic>): Type<any> {
//   return T.object(
//     Object.fromEntries(
//       diagnostics.map(({ valuePath, type }) => [valuePath, type]),
//     ),
//   )`The corrections to be applied to a previously-generated structured output.`.widen()
// }

// function prompt(
//   params: RefineParams,
//   diagnostics: Array<Diagnostic>,
// ): string {
//   const prompt = new Prompt()
//   prompt.h(1, "Overview")
//   prompt.lineBreak(2)
//   prompt.span`
//     A chat completion request was submitted with a JSON schema describing structured
//     output requirements. In the following sections, we'll cover the following.
//   `
//   prompt.lineBreak(2)
//   const hasMessages = !!params.messages.length
//     && params.messages.every((message) => {
//       const { content } = message
//       return (typeof content === "string" && !!content) || (
//         Array.isArray(content) && !!content.length
//         && content.every((part) => part.type === "text" && !!part.text)
//       )
//     })
//   prompt.list([
//     hasMessages && "The initial messages passed along to the completions endpoint.",
//     "The JSON schema of the initially-requested structured output.",
//     "The unmet constraints.",
//   ])
//   prompt.lineBreak(2)
//   prompt.span`Offer new and correct values for each of the specified diagnostics.`
//   prompt.lineBreak(2)
//   if (hasMessages) {
//     prompt.h(2, "Messages")
//     prompt.lineBreak(2)
//     params.messages.forEach((message, i) => {
//       prompt.h(3, `Message ${i} (${message.role})`)
//       const { content } = message
//       if (typeof content === "string") {
//         prompt.span(content)
//       } else if (Array.isArray(content)) {
//         content.forEach((part, i) => {
//           if (i !== 0) {
//             prompt.span(" ")
//           }
//           assert(
//             part.type === "text",
//             `${part.type} message content parts cannot be used in conjunction with structured outputs.`,
//           )
//           prompt.span(part.text)
//         })
//       }
//     })
//     prompt.lineBreak(2)
//   }
//   prompt.h(2, "Initial JSON Schema")
//   prompt.lineBreak(2)
//   prompt.json(params.response_format.json_schema)
//   prompt.lineBreak(2)
//   prompt.h(2, "Diagnostics")
//   prompt.lineBreak(2)
//   prompt.list(diagnostics.map(Diagnostic.toString))
//   return prompt.toString()
// }
