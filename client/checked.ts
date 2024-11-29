import dedent from "dedent"
import type Openai from "openai"
import type {
  ChatCompletionCreateParamsNonStreaming as ChatCompletionCreateParamsNonStreaming_,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions"
import {
  type Diagnostic,
  PathBuilder,
  ResponseFormat,
  serializeDiagnostics,
  T,
  VisitOutput,
} from "../mod.ts"
import { assert } from "../util/assert.ts"

export interface CheckedParams<T = any> extends
  Omit<
    ChatCompletionCreateParamsNonStreaming_,
    "audio" | "modalities" | "response_format" | "stream" | "stream_options"
  >
{
  response_format: ResponseFormat<T>
}

export interface CheckedOptions {
  signal: AbortSignal
}

/** Get the completion and then loop refinement assertions and resubmission until all assertions pass. */
export async function checked<T>(
  client: Openai,
  params: CheckedParams<T>,
  options?: CheckedOptions,
): Promise<T> {
  const initial = await client.chat.completions
    .create(params)
    .then(ResponseFormat.unwrap)
    .then(JSON.parse)
  const diagnostics: Array<Diagnostic> = []
  const processed0 = VisitOutput<T>(diagnostics)(
    initial,
    params.response_format[""],
    new PathBuilder(),
  )
  while (!options?.signal.aborted && diagnostics.length) {
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
    corrections.forEach(({ id, value }) => {})
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
  return dedent`
    ## Overview

    ${CORRECTION_PROMPT_PREFACE}

    ## Initial Messages

    ${serializeMessages(params.messages)}

    ## Initially-requested Structured Output JSON Schema

    \`\`\`json
    ${JSON.stringify(params.response_format[""].schema(), null, 2)}
    \`\`\

    ## Diagnostics

    ${serializeDiagnostics(diagnostics)}
  `
}

const CORRECTION_PROMPT_PREFACE = dedent`
  A completion request was submitted with a JSON schema describing the structured output requirements.
  In the following sections, we'll cover (A) the initial messages passed along to the completions
  endpoint, (B) the JSON schema of the initially-requested structured output, and (C) the unmet constraints.
  Offer new and correct values for each of the specified diagnostics.
`

function serializeMessages(messages: Array<ChatCompletionMessageParam>) {
  return messages.map((message, i) => {
    if (message.role === "system" || message.role === "user") {
      const contents = typeof message.content === "string"
        ? message.content
        : message.content.map((part) => {
          assert(
            part.type === "text",
            `${part.type} message content parts cannot be used in conjunction with structured outputs.`,
          )
          return part.text
        }).join("\n\n")
      return dedent`
        ### Message ${i} (${message.role})

        ${contents}
      `
    }
  })
}
