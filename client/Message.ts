import type { Type } from "../core/mod.ts"
import type { Adapter, AdapterConfig } from "./Adapter.ts"

export interface Liminal<C extends AdapterConfig> {
  <T>(type: Type<T, never>): Promise<T>
  (...texts: Array<string | C["I" | "O"]>): Liminal<C>
  (template: TemplateStringsArray, ...values: Array<string>): Liminal<C>

  adapter: Adapter<C>
  parent?: Liminal<C>
  messages: Array<C["I" | "O"]>

  branch: () => Liminal<C>
  serialize: () => Array<C["I" | "O"]>
}

export function Liminal<C extends AdapterConfig>(_adapter: Adapter<C>): Liminal<C> {
  throw 0
}

export namespace Liminal {
  export function merge<C extends AdapterConfig>(...liminals: Array<Liminal<C>>): Liminal<C> {
    throw 0
  }
}
