import type { ChatCompletion } from "openai/resources/chat/completions"
import type { ResponseFormatJSONSchema } from "openai/resources/shared"
import {
  type Diagnostic,
  OutputVisitorContext,
  serializeDiagnostics,
  type Type,
} from "../core/mod.ts"
import { assert, AssertionError, recombine } from "../util/mod.ts"

export interface ResponseFormat<T> extends FinalResponseFormat<T> {
  (template: TemplateStringsArray, ...values: Array<unknown>): FinalResponseFormat<T>
}

export function ResponseFormat<T>(
  name: string,
  type: Type<T, any, never>,
  refine?: boolean,
): ResponseFormat<T> {
  return Object.assign(
    (template: TemplateStringsArray, ...values: unknown[]) =>
      FinalResponseFormat(name, type, recombine(template, values), refine),
    FinalResponseFormat(name, type, undefined, refine),
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
  refine?: boolean,
): FinalResponseFormat<T> {
  return {
    "": type,
    type: "json_schema",
    json_schema: {
      name,
      ...description ? { description } : {},
      schema: type.schema(refine),
      strict: true,
    },
    into: (completion) => {
      const diagnostics: Array<Diagnostic> = []
      const visitorCtx = new OutputVisitorContext(diagnostics)
      const result = visitorCtx.visit({
        type,
        value: JSON.parse(ResponseFormat.unwrap(completion)),
      })
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
