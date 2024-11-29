import type { ChatCompletion } from "openai/resources/chat/completions"
import type { ResponseFormatJSONSchema } from "openai/resources/shared"
import type { Type } from "../Type.ts"
import { assert, AssertionError } from "../util/assert.ts"
import { recombine } from "../util/recombine.ts"
import { type Diagnostic, PathBuilder, serializeDiagnostics, VisitOutput } from "../VisitOutput.ts"

export interface ResponseFormat<T> extends FinalResponseFormat<T> {
  (template: TemplateStringsArray, ...values: Array<unknown>): FinalResponseFormat<T>
}

export function ResponseFormat<T>(name: string, type: Type<T, any, never>): ResponseFormat<T> {
  return Object.assign(
    (template: TemplateStringsArray, ...values: unknown[]) =>
      FinalResponseFormat(name, type, recombine(template, values)),
    FinalResponseFormat(name, type),
  )
}

export namespace ResponseFormat {
  export function unwrap(completion: ChatCompletion): string {
    const { choices: [firstChoice] } = completion
    assert(firstChoice, "No choices contained within the completion response.")
    const { finish_reason, message } = firstChoice
    assert(
      finish_reason === "stop",
      `Completion responded with "${finish_reason}" as finish reason; ${message}`,
    )
    const { content, refusal } = message
    assert(!refusal, `Openai refused to fulfill completion request; ${refusal}`)
    assert(content, "First response choice contained no content.")
    return content
  }
}

interface FinalResponseFormat<T> {
  "": Type<T, any, never>
  /** Tag required by the service. */
  type: "json_schema"
  /** The desired return type in JSON Schema. */
  json_schema: ResponseFormatJSONSchema.JSONSchema
  /** Transform the content of the first choice into a typed object. */
  into(completion: ChatCompletion): T
}

function FinalResponseFormat<T>(
  name: string,
  type: Type<T, any, never>,
  description?: string,
): FinalResponseFormat<T> {
  return {
    "": type,
    type: "json_schema",
    json_schema: {
      name,
      description,
      schema: type.schema(),
      strict: true,
    },
    into: (completion) => {
      const diagnostics: Array<Diagnostic> = []
      const result = VisitOutput<T>(diagnostics)(
        JSON.parse(ResponseFormat.unwrap(completion)),
        type,
        new PathBuilder(),
      )
      if (diagnostics.length) {
        throw new AssertionError(serializeDiagnostics(diagnostics))
      }
      return result
    },
    ...{
      /** Prevents `JSON.stringify` from including `""` and `into` in serialization. */
      toJSON() {
        const { type, json_schema } = this
        return { type, json_schema }
      },
    },
  }
}
