import { assert } from "@std/assert"
import type Openai from "openai"
import type { ResponseFormatJSONSchema } from "openai/resources/index.js"
import type { RootTy } from "./core/mod.ts"
import { recombineTaggedTemplateArgs } from "./util/recombineTaggedTemplateArgs.ts"

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
      parse(completion: ChatCompletion): TypedChatCompletion<T> {
        return {
          ...completion,
          choices: completion.choices.map((choice) => ({
            ...choice,
            message: {
              ...choice.message,
              content: choice.message.content ? JSON.parse(choice.message.content) : null,
            },
          })),
        }
      },
      parseFirstOrThrow(completion: ChatCompletion): T {
        const { choices: [firstChoice], usage } = completion
        assert(firstChoice)
        const { finish_reason, message } = firstChoice
        const { content, refusal } = message
        assert(content, JSON.stringify({ finish_reason, refusal, usage }))
        return JSON.parse(content)
      },
      toJSON() {
        const { type, json_schema } = this
        return { type, json_schema }
      },
    },
  )
}

export interface ResponseFormat<T> {
  (template: TemplateStringsArray, ...quasis: Array<string>): ResponseFormat<T>
  type: "json_schema"
  /** The desired return type in JSON Schema. */
  json_schema: ResponseFormatJSONSchema.JSONSchema
  /** Parse inner responses into a typed object. */
  parse(completion: ChatCompletion): TypedChatCompletion<T>
  /** Parse and return the first inner response into a typed object. */
  parseFirstOrThrow(completion: ChatCompletion): T
}

export type TypedChatCompletion<T> = Omit<ChatCompletion, "choices"> & {
  choices: Array<
    Omit<ChatCompletionChoice, "message"> & {
      message: Omit<ChatCompletionMessage, "content"> & {
        content: T
      }
    }
  >
}

type ChatCompletion = Openai.Chat.ChatCompletion
type ChatCompletionChoice = Openai.Chat.ChatCompletion.Choice
type ChatCompletionMessage = Openai.Chat.Completions.ChatCompletionMessage
