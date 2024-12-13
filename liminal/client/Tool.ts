import type { Type } from "../../core/mod.ts"
import type { AdapterDescriptor } from "./Adapter.ts"
import type { Session } from "./Session.ts"

export interface ToolConfig<T = any> {
  description: string
  type: Type<T, never>
  f: (value: T) => unknown
  signal?: AbortSignal
}

export class Tool<D extends AdapterDescriptor> {
  constructor(
    readonly session: Session<D>,
    readonly config: ToolConfig,
  ) {}
}
