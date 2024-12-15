import type { Type } from "../core/mod.ts"

export interface AdapterDescriptor {
  /** Supported model names. */
  model: string
  /** Supported completion message roles. */
  role: string
  /** Provider completion. */
  completion: unknown
  /** Provider-specific input message. */
  I: unknown
  /** Provider-specific output message. */
  O: unknown
}

export interface Adapter<D extends AdapterDescriptor> {
  /** Default configuration for the provider. */
  defaults: AdapterDefaults<D>
  /** Type transform to apply. Useful in cases where certain types are not allowed to be root types. */
  transformRootType?: <T>(type: Type<T, never>) => Type<T, never>
  /** Format text into the provider's message type. */
  formatInput: (texts: Array<string>, role?: D["role"]) => D["I"]
  /** Do something with completions before they're processed (useful for metering). */
  hook?: (completion: D["completion"]) => void
  /** Request a text completion. */
  text: (messages: Array<D["I" | "O"]>, config?: TextConfig<D>) => Promise<D["completion"]>
  /** Request a structured output completion. */
  value: <T>(type: Type<T, never>, params: ValueConfig<D>) => Promise<D["completion"]>
  /** Unwrap the message from the completion. */
  unwrapOutput: (message: D["completion"]) => D["O"]
  /** Unwrap the content from within the completion message. */
  unwrapRaw: (message: D["O"]) => string
}

export interface AdapterDefaults<D extends AdapterDescriptor> {
  /** What model to use when none specified. */
  model: D["model"]
  /** What role to use in constructing a message when none specified. */
  role: D["role"]
  /** Opening message to include in value completion when no message history nor messages supplied. */
  opening: D["I"]
}

export interface TextConfig<D extends AdapterDescriptor> {
  model?: D["model"]
}

export interface ValueConfig<D extends AdapterDescriptor> {
  messages?: Array<D["I" | "O"]>
  name?: string
  description?: string
  model?: D["model"]
}
