import type { Type } from "../core/mod.ts"
import type { AdapterDescriptor } from "./Adapter.ts"
import type { Session } from "./Session.ts"

export interface ToolConfig<T = any> {
  description: string
  f: (value: T) => unknown
  signal?: AbortSignal
}

export class Tool<D extends AdapterDescriptor, T> {
  constructor(
    readonly session: Session<D>,
    readonly type: Type<T, never>,
    readonly config: ToolConfig,
  ) {}
}
