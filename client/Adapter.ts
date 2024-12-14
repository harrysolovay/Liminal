import type { Type } from "../core/mod.ts"

export interface AdapterDescriptor {
  /** Supported model names. */
  model: string
  /** Supported completion message roles. */
  role: string
  /** Provider completion. */
  completion: unknown
  /** Provider message. */
  message: unknown
}

export interface Adapter<D extends AdapterDescriptor> {
  /** List of models that do not support structured outputs. */
  unstructured?: Array<D["model"]>
  /** Default configuration for the provider. */
  defaults: AdapterDefaults<D>
  /** Type transform to apply. Useful in cases where certain types are not allowed to be root types. */
  transformType?: <T>(type: Type<T, never>) => Type<T, never>
  /** Format text into the provider's message type. */
  formatMessage: (texts: Array<string>, role?: D["role"]) => D["message"]
  /** Do something with completions before they're processed (useful for metering). */
  hook?: (completion: D["completion"]) => void
  /** Request a text completion. */
  text: (messages: Array<D["message"]>, config?: TextConfig<D>) => Promise<D["completion"]>
  /** Request a structured output completion. */
  value: <T>(type: Type<T, never>, params: ValueConfig<D>) => Promise<D["completion"]>
  /** Unwrap the message from the completion. */
  unwrapMessage: (message: D["completion"]) => D["message"]
  /** Unwrap the content from within the completion message. */
  unwrapContent: (message: D["message"]) => string
}

export interface AdapterDefaults<D extends AdapterDescriptor> {
  /** What model to use when none specified. */
  model: D["model"]
  /** What role to use in constructing a message when none specified. */
  role: D["role"]
  /** Opening message to include in value completion when no message history nor messages supplied. */
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
