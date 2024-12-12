import type { JSONType } from "../core/mod.ts"

export interface SessionConfig<M, N extends string> {
  defaultModel: N
  defaultSystemText: string
  toMessage: (text: string, role: "system" | "user") => M
  completion: (
    name: string,
    description: undefined | string,
    jsonType: JSONType,
    messages: Array<M>,
    model: N,
  ) => Promise<unknown>
}
