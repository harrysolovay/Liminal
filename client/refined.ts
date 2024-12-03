import type Openai from "openai"
import type {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions"
import type { CompletionUsage } from "openai/resources/completions"
import { deserializeValue, Diagnostic, T } from "../json/mod.ts"
import { assert } from "../util/assert.ts"
import { parseChoice, unwrapChoice } from "./oai_util.ts"
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
  maxRefinements?: number
  maxTokens?: Partial<CompletionUsage>
}

/** Get the completion and then loop refinement assertions and resubmission until all assertions pass. */
export async function refined<T>(
  client: Openai,
  params: CheckedParams<T>,
  options?: CheckedOptions,
): Promise<T> {
  const { signal, maxRefinements, maxTokens: _maxTokens } = options ?? {}
  assert(
    maxRefinements === undefined || (maxRefinements >= 1 && Number.isInteger(maxRefinements)),
    "`CheckedOptions.maxRefinements` must be an integer greater than 1.",
  )
  const completion = await client.chat.completions.create(params)
  const diagnostics: Array<Diagnostic> = []
  const content = unwrapChoice(completion)
  const value = deserializeValue(params.response_format[""], parseChoice(content), diagnostics)
  const messages: ChatCompletionMessageParam[] = [...params.messages, {
    role: "assistant",
    content,
  }]
  let correctionsRemaining = maxRefinements ?? Infinity
  let initialCorrection = true
  while (correctionsRemaining-- && !signal?.aborted && diagnostics.length) {
    const response_format = ResponseFormat("corrections", Corrections(diagnostics))
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
    })
    const { usage: _usage } = correctionsCompletion
    const corrections = response_format.into(correctionsCompletion)
    while (diagnostics.length) {
      const { setValue, valuePath, type } = diagnostics.shift()!
      setValue(deserializeValue(type as never, corrections[valuePath], diagnostics))
    }
  }
  return value
}

function Corrections(diagnostics: Array<Diagnostic>) {
  return T
    .object(
      Object.fromEntries(diagnostics.map(({ valuePath, type }) => [valuePath, type])),
    )`The corrections to be applied to a previously-generated structured output.`
    .widen()
}

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
