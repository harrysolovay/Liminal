import type { ChatCompletion } from "openai/resources/chat/completions"
import type { ResponseFormatJSONSchema } from "openai/resources/shared"
import { assert } from "../asserts/mod.ts"
import type { Type } from "../core/mod.ts"
import type { ValueDiagnostic } from "../json/mod.ts"
import { deserializeValue, Schema, toSchema } from "../json/mod.ts"
import { recombine } from "../util/mod.ts"

export interface ResponseFormat<T> extends FinalResponseFormat<T> {
  (template: TemplateStringsArray, ...values: Array<unknown>): FinalResponseFormat<T>
}

export function ResponseFormat<T>(name: string, type: Type<T>): ResponseFormat<T> {
  return Object.assign(
    (template: TemplateStringsArray, ...values: unknown[]) =>
      FinalResponseFormat(name, type, recombine(template, values)),
    FinalResponseFormat(name, type, undefined),
  )
}

export namespace ResponseFormat {
  export function parseChoice(completion: ChatCompletion): unknown {
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
    const parsed = JSON.parse(content)
    if ("__unsafe_structured_output" in parsed) {
      return parsed.__unsafe_structured_output
    }
    return content
  }
}

interface FinalResponseFormat<T> {
  /** The type from which the schema is derived. */
  "": Type<T>
  /** Tag required by the service. */
  type: "json_schema"
  /** The desired return type in JSON Schema. */
  json_schema: ResponseFormatJSONSchema.JSONSchema
  /** Transform the content of the first choice into a typed object. */
  into(completion: ChatCompletion): T
}

function FinalResponseFormat<T>(
  name: string,
  type: Type<T>,
  description?: string,
): FinalResponseFormat<T> {
  let schema = toSchema(type)
  if (!Schema.isRootCompatible(schema)) {
    schema = {
      type: "object",
      properties: {
        __unsafe_structured_output: schema,
      },
      additionalProperties: false,
      required: ["value"],
    }
  }
  return {
    "": type,
    type: "json_schema",
    json_schema: {
      name,
      description,
      schema,
      strict: true,
    },
    into: (completion) => {
      const raw = ResponseFormat.parseChoice(completion)
      const diagnostics: Array<ValueDiagnostic> = []
      const value = deserializeValue(type, raw, diagnostics)
      if (diagnostics.length) {
        console.log(diagnostics)
        // TODO
      }
      return value
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
