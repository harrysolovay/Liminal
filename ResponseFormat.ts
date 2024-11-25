import type { ChatCompletion, ChatCompletionChoice, JsonSchema } from "./oai.ts"
import type { Ty } from "./types/mod.ts"
import { recombine } from "./util/recombine.ts"

export interface ResponseFormat<T> {
  (template: TemplateStringsArray, ...quasis: Array<string>): ResponseFormat<T>
  type: "json_schema"
  /** The desired return type in JSON Schema. */
  json_schema: JsonSchema
  /** Transform the content of the first choice into a typed object. */
  into(completion: ChatCompletion): T
}

export function ResponseFormat<T>(name: string, ty: Ty<T, never, true>): ResponseFormat<T> {
  return ResponseFormat_(name, ty)
}

function ResponseFormat_<T>(
  name: string,
  ty: Ty<T, never>,
  description?: string,
): ResponseFormat<T> {
  return Object.assign(
    (template: TemplateStringsArray, ...quasis: Array<string>) =>
      ResponseFormat_(
        name,
        ty,
        description ? `${description} ${recombine(template, quasis)}` : undefined,
      ),
    {
      type: "json_schema" as const,
      json_schema: {
        name,
        description,
        schema: ty.schema(),
        strict: true,
      },
      into: (completion: ChatCompletion): T => {
        return ty[""].transform(JSON.parse(ResponseFormat.unwrapFirstChoice(completion)))
      },
      toJSON() {
        const { type, json_schema } = this
        return { type, json_schema }
      },
    },
  )
}

export namespace ResponseFormat {
  export function unwrapFirstChoice(completion: ChatCompletion): string {
    const { choices: [firstChoice] } = completion
    if (!firstChoice) {
      throw new ResponseFormatUnwrapError("No choices contained within the completion response.")
    }
    return unwrapChoice(firstChoice)
  }

  export function unwrapChoices(completions: ChatCompletion): string[] {
    return completions.choices.map(unwrapChoice)
  }

  function unwrapChoice(choice: ChatCompletionChoice) {
    const { finish_reason, message } = choice
    if (finish_reason !== "stop") {
      throw new ResponseFormatUnwrapError(
        `Completion responded with "${finish_reason}" as finish reason; ${message}`,
      )
    }
    const { content, refusal } = message
    if (refusal) {
      throw new ResponseFormatUnwrapError(
        `Openai refused to fulfill completion request; ${refusal}`,
      )
    }
    if (!content) {
      throw new ResponseFormatUnwrapError("First response choice contained no content.")
    }
    return content
  }
}

export class ResponseFormatUnwrapError extends Error {
  override readonly name = "UnwrapResponseError"
}
