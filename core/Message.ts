import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"

export type MessageLike = string | Message

export interface Message {
  role: "system" | "user" | "assistant" | "reducer" | "subthread"
  body: string
  created: Date
}

export function system(template: TemplateStringsArray, ...substitutions: Array<string>): Message
export function system(body: string): Message
export function system(e0: TemplateStringsArray | string, ...rest: Array<string>): Message {
  return {
    role: "system",
    body: isTemplateStringsArray(e0) ? String.raw(e0, ...rest) : e0,
    created: new Date(),
  }
}
