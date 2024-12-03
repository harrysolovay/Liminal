import type Openai from "openai"
import type {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions"
import { deserialize, Diagnostic, T } from "../core/mod.ts"
import { assert, tap } from "../util/mod.ts"
import { parseChoice, unwrapChoice } from "./oai_util.ts"
import { ResponseFormat } from "./ResponseFormat.ts"
import type { TokenAllowanceManager } from "./TokenAllowanceManager.ts"

export interface RefinedParams<T = any> extends
  Omit<
    ChatCompletionCreateParamsNonStreaming,
    "audio" | "modalities" | "response_format" | "stream" | "stream_options"
  >
{
  response_format: ResponseFormat<T>
}

export interface RefinedOptions {
  signal?: AbortSignal
  max?: number
  allowance?: TokenAllowanceManager
}

/** Get the completion and then loop refinement assertions and resubmission until all assertions pass. */
export async function refined<T>(
  client: Openai,
  params: RefinedParams<T>,
  options?: RefinedOptions,
): Promise<T> {
  const { signal, max, allowance } = options ?? {}
  assert(
    max === undefined || (max >= 1 && Number.isInteger(max)),
    "`CheckedOptions.maxRefinements` must be an integer greater than 1.",
  )
  const completion = await client.chat.completions
    .create(params)
    .then(tap(allowance?.ingest))
  let diagnosticsPending: Array<Promise<Diagnostic | undefined>> = []
  const content = unwrapChoice(completion)
  const messages: ChatCompletionMessageParam[] = [...params.messages, {
    role: "assistant",
    content,
  }]
  const root = deserialize(params.response_format[""], parseChoice(content), diagnosticsPending)
  let correctionsRemaining = max ?? Infinity
  let initialCorrection = true
  while (
    correctionsRemaining-- && !signal?.aborted && !allowance?.stop
    && diagnosticsPending.length
  ) {
    const diagnostics = await Promise
      .all(diagnosticsPending)
      .then((v) => v.filter((v) => v !== undefined))
    diagnosticsPending = []
    if (!diagnostics.length) {
      break
    }
    const CurrentCorrections = Corrections(diagnostics)
    const response_format = ResponseFormat("corrections", CurrentCorrections)
    initialCorrection = false
    messages.push({
      role: "user",
      content: initialCorrection
        ? prompt(params, diagnostics)
        : diagnostics.map(Diagnostic.toString).join("\n\n"),
    })
    const correctionsCompletion = await client.chat.completions.create({
      ...params,
      messages,
      response_format,
    }).then(tap(allowance?.ingest))
    const choice = unwrapChoice(correctionsCompletion)
    messages.push({
      role: "assistant",
      content: choice,
    })
    const corrections = deserialize(CurrentCorrections, parseChoice(choice))
    while (diagnostics.length) {
      const { setValue, valuePath, type } = diagnostics.shift()!
      setValue(
        deserialize(
          type as never,
          corrections[valuePath],
          (!correctionsRemaining || (signal && signal.aborted)) ? undefined : diagnosticsPending,
        ),
      )
    }
  }
  return root
}

function Corrections(diagnostics: Array<Diagnostic>) {
  return T
    .object(
      Object.fromEntries(diagnostics.map(({ valuePath, type }) => [valuePath, type])),
    )`The corrections to be applied to a previously-generated structured output.`
    .widen()
}

function prompt(
  params: RefinedParams,
  diagnostics: Array<Diagnostic>,
): string {
  const messageSection = maybeSerializeMessages(params)
  return `## Overview

${prefaceSection(!!messageSection)}
${messageSection}
## Initially-requested Structured Output JSON Schema

\`\`\`json
${JSON.stringify(params.response_format.json_schema, null, 2)}
\`\`\`

## Diagnostics

${diagnostics.map(Diagnostic.toString).join("\n\n")}`
}

function prefaceSection(includeMessages: boolean) {
  const sections = [...SECTIONS]
  if (!includeMessages) {
    sections.shift()
  }
  return `A chat completion request was submitted with a JSON schema describing structured output requirements. In the following sections, we'll cover the following:

${sections.map((description, i) => `${i + 1}. ${description}`).join("\n")}

Offer new and correct values for each of the specified diagnostics.`
}

const SECTIONS = [
  "the initial messages passed along to the completions endpoint",
  "the JSON schema of the initially-requested structured output",
  "the unmet constraints",
]

function maybeSerializeMessages(params: RefinedParams) {
  if (!params.messages.length) {
    return ""
  }
  const messages = params.messages.map((message, i) => {
    if (message.role === "system" || message.role === "user") {
      const contents = typeof message.content === "string"
        ? message.content
        : message.content.map((part) => {
          assert(
            part.type === "text",
            `${part.type} message content parts cannot be used in conjunction with structured outputs.`,
          )
          return part.text
        }).join("\n")
      return contents.length
        ? `### Message ${i} (${message.role})

${contents}`
        : undefined
    }
  }).filter(Boolean)
  return messages.length
    ? `## Initial Messages

${messages}`
    : ""
}
