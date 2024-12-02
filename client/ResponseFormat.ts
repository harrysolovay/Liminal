import type { ChatCompletion } from "openai/resources/chat/completions"
import type { ResponseFormatJSONSchema } from "openai/resources/shared"
import { assert } from "../asserts/mod.ts"
import { type Diagnostic, serializeDiagnostics, type Type, VisitValue } from "../core/mod.ts"
import { toJsonSchema } from "../json_schema/mod.ts"
import { Schema } from "../json_schema/Schema.ts"
import { AssertionError, recombine } from "../util/mod.ts"

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
  export function unwrapChoice(completion: ChatCompletion): string {
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
  "": {
    /** The type from which the schema is derived. */
    type: Type<T>
    /** `true` if the root type is not an object type. */
    wrap: boolean
  }
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
  let schema = toJsonSchema(type)
  const wrap = !Schema.isRootCompatible(schema)
  if (wrap) {
    schema = {
      type: "object",
      properties: {
        value: schema,
      },
      additionalProperties: false,
      required: ["value"],
    }
  }
  return {
    "": { type, wrap },
    type: "json_schema",
    json_schema: {
      name,
      description,
      schema,
      strict: true,
    },
    into: (completion) => {
      const choice = ResponseFormat.unwrapChoice(completion)
      const { value, diagnostics } = deserializeChoice(choice, type, wrap)
      if (diagnostics.length) {
        throw new AssertionError(serializeDiagnostics(diagnostics))
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

export function deserializeChoice<T>(
  choice: string,
  type: Type<T>,
  wrap: boolean,
): DeserializeChoiceResult<T> {
  let value = JSON.parse(choice)
  if (wrap) {
    value = value.value
  }
  const diagnostics: Array<Diagnostic> = []
  const result = {
    root: VisitValue(diagnostics)(value, type, () => (value) => {
      result.root = value
    }),
  }
  return {
    diagnostics,
    value: result.root as T,
  }
}

export type DeserializeChoiceResult<T> = {
  diagnostics: Array<Diagnostic>
  value: T
}
