import type { Type } from "../core/mod.ts"

export interface AdapterDescriptor {
  M: string
  I: unknown
  O: unknown
}

export interface Adapter<D extends AdapterDescriptor> {
  formatInput: (raw: string) => D["I"]
  unwrapOutput: (message: D["O"]) => string
  complete: <T>(config: AdapterCompleteConfig<T, D>) => Promise<D["O"]>
  transform?: <T>(type: Type<T, never>) => Type<T>
}

export interface AdapterCompleteConfig<T, D extends AdapterDescriptor> {
  type: Type<T, never>
  messages?: Array<D["I" | "O"]>
  model?: D["M"]
}
