import type Openai from "openai"
import type { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions"
import type { CompletionUsage } from "openai/resources/completions"
import { type Diagnostic, serializeDiagnostics, VisitValue } from "../core/mod.ts"
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
  maxRefinements?: number
  maxTokens?: Partial<CompletionUsage>
}

/** Get the completion and then loop refinement assertions and resubmission until all assertions pass. */
export async function checked<T>(
  client: Openai,
  params: CheckedParams<T>,
  options?: CheckedOptions,
): Promise<T> {
  const { signal, maxRefinements, maxTokens: _maxTokens } = options ?? {}
  assert(
    maxRefinements === undefined || (maxRefinements >= 1 && Number.isInteger(maxRefinements)),
    "`CheckedOptions.maxRefinements` must be an integer greater than 1.",
  )
  // TODO: handle non-root in consistent way.
  const initial = await client.chat.completions
    .create(params)
    .then(ResponseFormat.unwrap)
    .then(JSON.parse)
  const diagnostics: Array<Diagnostic> = []
  const processed0 = VisitValue(diagnostics)(initial, params.response_format[""])
  let correctionsRemaining = maxRefinements ?? Infinity
  while (correctionsRemaining-- && !signal?.aborted && diagnostics.length) {
    const Corrections = T
      .object(
        Object.fromEntries(diagnostics.map(({ valuePath, type }) => [valuePath, type])),
      )`The corrections to be applied to a previously-generated structured output.`
      .unchecked()
    const response_format = ResponseFormat("corrections", Corrections)
    const completions = await client.chat.completions.create({
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
    const { usage: _usage } = completions
    const corrections = response_format.into(completions)
    while (diagnostics.length) {
      const { setValue, valuePath } = diagnostics.shift()!
      const correction = corrections[valuePath]
      console.log({ diagnostics, correction })
      // setValue(corrections[valuePath])
    }
  }
  return processed0 as any
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
