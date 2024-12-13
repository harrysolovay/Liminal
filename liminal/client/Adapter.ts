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
  loadThread: LoadThread<D>
  saveThread?: SaveThread<D>
  formatMessage: (texts: Array<string>, role?: D["role"]) => D["message"]
  unwrapMessage: (message: D["message"]) => string
  completeText: (messages: Array<D["message"]>, model?: D["model"]) => Promise<D["message"]>
  completeJSON: <T>(params: CompletionJSONParams<D, T>) => Promise<D["message"]>
}

export interface AdapterDefaults<D extends AdapterDescriptor> {
  model: D["model"]
  // instructions: string
  role: D["role"]
}

export type LoadThread<D extends AdapterDescriptor> = (
  id?: string,
) => PromiseOr<Array<D["message"]>>

export type SaveThread<D extends AdapterDescriptor> = (
  id: string,
  current: Array<D["message"]>,
  previous?: Array<D["message"]>,
) => PromiseOr<void>

export interface CompletionJSONParams<D extends AdapterDescriptor, T> {
  messages?: Array<D["message"]>
  name: string
  type: Type<T, never>
  description?: string
  model?: D["model"]
}
