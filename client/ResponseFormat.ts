import type { ChatCompletion } from "openai/resources/chat/completions"
import type { ResponseFormatJSONSchema } from "openai/resources/shared"
import type { Type } from "../core/mod.ts"
import { deserialize, Schema, toSchema } from "../json/mod.ts"
import { recombine } from "../util/mod.ts"
import { parseChoice, unwrapChoice } from "./oai_util.ts"

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
      required: ["__unsafe_structured_output"],
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
    into: (completion) => deserialize(type, parseChoice(unwrapChoice(completion))),
    ...{
      /** Prevents `JSON.stringify` from including `""` and `into` in serialization. */
      toJSON() {
        const { type, json_schema } = this
        return { type, json_schema }
      },
    },
  }
}
