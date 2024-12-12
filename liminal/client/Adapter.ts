import type { JSONTypeName, Type } from "../core/mod.ts"

export interface Adapter<M, A extends unknown[]> {
  open: (...args: A) => Array<M> | Promise<Array<M>>
  completion: <T>(params: CompletionParams<M, T>) => Promise<unknown>
  text: (role: "system" | "user", texts: Array<string>) => M
}

export type CompletionParams<M, T> =
  & {
    messages: Array<M>
  }
  & (
    | {
      type: Type<Exclude<JSONTypeName, "string">, T, never>
      description?: string
    }
    | {
      type: Type<"string", T, never>
      description?: never
    }
    | {
      type?: never
      description?: never
    }
  )
