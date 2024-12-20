import { deserialize, isType, type Type } from "../core/mod.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { recombine } from "../util/mod.ts"
import type { Adapter, Provider } from "./Adapter.ts"
import type { Tool } from "./Tool.ts"

export interface Liminal<P extends Provider> {
  <T>(type: Type<T, never>, config?: CompleteConfig<P>): Promise<T>
  (...texts: Array<number | string | P["I" | "O"]>): Liminal<P>
  (template: TemplateStringsArray, ...values: Array<number | string>): Liminal<P>

  adapter: Adapter<P>
  messages: Array<P["I" | "O"]>
}

export interface CompleteConfig<P extends Provider> {
  model?: P["M"]
  name?: string
  options?: P["E"]
  tools?: Record<string, Tool>
}

export function Liminal<P extends Provider>(
  adapter: Adapter<P>,
  _config?: LiminalOptions<P>,
): Liminal<P> {
  const messages: Array<P["I" | "O"]> = []
  const self = Object.assign($, {
    adapter,
    messages,
  } as never)
  return self

  function $(...args: Array<unknown>) {
    const [e0, ...rest] = args
    if (isType(e0)) {
      const type = (adapter.transform?.(e0 as never) ?? e0) as Type<unknown, never>
      const [maybeConfig] = rest
      return adapter.complete({
        type,
        messages,
        ...(typeof maybeConfig === "object" && maybeConfig !== null)
          ? {
            model: "model" in maybeConfig ? maybeConfig.model as string : undefined,
            name: "name" in maybeConfig ? maybeConfig.name as string : undefined,
          }
          : {},
      }).then((message) => {
        messages.push(message)
        return deserialize(type, adapter.unwrapOutput(message))
      })
    } else if (typeof e0 === "function") {
      return e0(self)
    } else if (isTemplateStringsArray(e0)) {
      messages.push(adapter.formatInput(recombine(e0, rest)))
    } else {
      args.forEach((arg) => {
        messages.push(
          typeof arg === "string"
            ? adapter.formatInput(arg)
            : typeof arg === "number"
            ? adapter.formatInput(arg.toString())
            : arg,
        )
      })
    }
    return self
  }
}

export type ToolArgs = Record<string, Array<unknown>>

export interface LiminalOptions<P extends Provider> {
  messages?: Array<P["I" | "O"]>
  persistence?: unknown
}

// parent?: Liminal<C>
// branch: () => Liminal<C>
// serialize: () => Array<C["I" | "O"]>
// merge
