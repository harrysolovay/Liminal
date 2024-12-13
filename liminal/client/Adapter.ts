import type { Type } from "../core/mod.ts"
import type { PromiseOr } from "../util/mod.ts"

export interface AdapterDescriptor {
  model: string
  role: string
  message: unknown
  messageParams: unknown[]
}

export interface Adapter<D extends AdapterDescriptor> {
  unstructured?: Array<D["model"]>
  defaults: AdapterDefaults<D>
  transformType?: <T>(type: Type<T, never>) => Type<T, never>
  loadMessages: LoadMessages<D>
  formatMessage: (texts: Array<string>, role?: D["role"]) => D["message"]
  unwrapMessage: (message: D["message"]) => string
  completeText: (messages: Array<D["message"]>, model?: D["model"]) => Promise<D["message"]>
  completeValue: <T>(params: CompletionValueConfig<D, T>) => Promise<D["message"]>
}

export interface AdapterDefaults<D extends AdapterDescriptor> {
  model: D["model"]
  instructions: string
  role: D["role"]
}

export type LoadMessages<D extends AdapterDescriptor> = (
  sessionId?: string,
) => PromiseOr<Array<D["message"]>>

export interface CompletionValueConfig<D extends AdapterDescriptor, T> {
  messages?: Array<D["message"]>
  name?: string
  type: Type<T, never>
  description?: string
  model?: D["model"]
}
