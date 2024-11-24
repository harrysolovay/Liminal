import type Openai from "openai"
import type { ResponseFormatJSONSchema } from "openai/resources/index.js"
import type { RootTy } from "./types/mod.ts"
import { recombineTaggedTemplateArgs } from "./util/recombineTaggedTemplateArgs.ts"

export interface ResponseFormat<T> {
  (template: TemplateStringsArray, ...quasis: Array<string>): ResponseFormat<T>
  type: "json_schema"
  /** The desired return type in JSON Schema. */
  json_schema: ResponseFormatJSONSchema.JSONSchema
  /** Parse the content of the first choice into a typed object. */
  parseFirstChoice(completion: ChatCompletion): T
  /** Parse all choice contents into an array of typed object. */
  parseChoices(completion: ChatCompletion): Array<T>
}

export function ResponseFormat<T>(name: string, ty: RootTy<T, never>): ResponseFormat<T> {
  return ResponseFormat_(name, ty)
}

function ResponseFormat_<T>(
  name: string,
  ty: RootTy<T, never>,
  description?: string,
): ResponseFormat<T> {
  return Object.assign(
    (template: TemplateStringsArray, ...quasis: Array<string>) =>
      ResponseFormat_(
        name,
        ty,
        description ? `${description} ${recombineTaggedTemplateArgs(template, quasis)}` : undefined,
      ),
    {
      type: "json_schema" as const,
      json_schema: {
        name,
        description,
        schema: ty.schema(),
        strict: true,
      },
      parseFirstChoice: (completion: ChatCompletion): T => {
        return JSON.parse(ResponseFormat.unwrapFirstChoice(completion))
      },
      parseChoices: (completion: ChatCompletion): Array<T> => {
        return ResponseFormat.unwrapChoices(completion).map((content) => JSON.parse(content))
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

export type TypedChatCompletion<T> = Omit<ChatCompletion, "choices"> & {
  choices: Array<
    Omit<ChatCompletionChoice, "message"> & {
      message: Omit<Openai.Chat.Completions.ChatCompletionMessage, "content"> & {
        content: T
      }
    }
  >
}

type ChatCompletion = Openai.Chat.ChatCompletion
type ChatCompletionChoice = Openai.Chat.Completions.ChatCompletion.Choice
