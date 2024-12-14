import type { Type } from "../core/mod.ts"

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
  formatMessage: (texts: Array<string>, role?: D["role"]) => D["message"]
  unwrapMessage: (message: D["message"]) => string
  text: (messages: Array<D["message"]>, config?: TextConfig<D>) => Promise<D["message"]>
  value: <T>(type: Type<T, never>, params: ValueConfig<D>) => Promise<D["message"]>
}

export interface AdapterDefaults<D extends AdapterDescriptor> {
  model: D["model"]
  role: D["role"]
  opening: D["message"]
}

export interface TextConfig<D extends AdapterDescriptor> {
  model?: D["model"]
}

export interface ValueConfig<D extends AdapterDescriptor> {
  messages?: Array<D["message"]>
  name?: string
  description?: string
  model?: D["model"]
}
