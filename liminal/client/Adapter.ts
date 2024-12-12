import type { JSONTypeName, Type } from "../core/mod.ts"

export interface Adapter<M, A extends unknown[]> {
  open: (...args: A) => Array<M> | Promise<Array<M>>
  completion: <T>(params: CompletionParams<M, T>) => Promise<unknown>
  text: (role: "system" | "user", texts: Array<string>) => M
}

export type CompletionParams<M, T> =
  & {
    messages: Array<M>
    description?: string
  }
  & (
    | {
      name: string
      type: Type<JSONTypeName, T, never>
    }
    | {
      name?: never
      type?: never
    }
  )
