import type { Type } from "../core/mod.ts"
import type { AdapterDescriptor } from "./Adapter.ts"
import type { Liminal } from "./Liminal.ts"

export interface ToolConfig<T = any> {
  description: string
  f: (value: T) => unknown
  signal?: AbortSignal
}

export class Tool<D extends AdapterDescriptor, T> {
  constructor(
    readonly liminal: Liminal<D>,
    readonly type: Type<T>,
    readonly config: ToolConfig,
  ) {}
}
