import type Openai from "openai"
import type { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions"
import { type Diagnostic, OutputVisitorContext, serializeDiagnostics } from "../core/mod.ts"
import * as T from "../types/mod.ts"
import { assert } from "../util/assert.ts"
import { ResponseFormat } from "./ResponseFormat.ts"

export interface CheckedParams<T = any> extends
  Omit<
    ChatCompletionCreateParamsNonStreaming,
    "audio" | "modalities" | "response_format" | "stream" | "stream_options"
  >
{
  response_format: ResponseFormat<T>
}

export interface CheckedOptions {
  signal?: AbortSignal
  maxCorrections?: number
  // maxTokens?: number
}

/** Get the completion and then loop refinement assertions and resubmission until all assertions pass. */
export async function checked<T>(
  client: Openai,
  params: CheckedParams<T>,
  options?: CheckedOptions,
): Promise<T> {
  const { maxCorrections } = options ?? {}
  assert(
    maxCorrections === undefined || (maxCorrections >= 1 && Number.isInteger(maxCorrections)),
    "`CheckedOptions.maxCorrections` must be an integer greater than 1.",
  )
  const initial = await client.chat.completions
    .create(params)
    .then(ResponseFormat.unwrap)
    .then(JSON.parse)
  const diagnostics: Array<Diagnostic> = []
  const visitorCtx = new OutputVisitorContext(diagnostics)
  const processed0 = visitorCtx.visit({
    type: params.response_format[""],
    value: initial,
  })
  let correctionsRemaining = options?.maxCorrections ?? Infinity
  while (correctionsRemaining-- && !options?.signal?.aborted && diagnostics.length) {
    console.log(prompt(params, diagnostics))
    await new Promise(() => {})
    const { corrections } = await client.chat.completions
      .create({
        ...params,
        messages: [{
          role: "user",
          content: [{
            type: "text",
            text: prompt(params, diagnostics),
          }],
        }],
        response_format,
      })
      .then(response_format.into)
    // TODO:
    // corrections.forEach(({ id, value }) => {})
  }
  return processed0
}

const response_format = ResponseFormat(
  "corrections",
  T.object({
    corrections: T.array(T.object({
      id: T.number`The ID of the diagnostic to which the new value corresponds.`,
      value: T.string`The new, correct value.`,
    }))`The corrections to be applied to a previously-generated structured output.`,
  }),
)

function prompt(
  params: CheckedParams,
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

${serializeDiagnostics(diagnostics)}`
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

function maybeSerializeMessages(params: CheckedParams) {
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
