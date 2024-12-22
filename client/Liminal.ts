import type { Type } from "../core/mod.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { recombine } from "../util/mod.ts"
import type { Adapter, Provider } from "./Adapter.ts"
import type { Tool } from "./Tool.ts"

export interface Liminal<P extends Provider> {
  (...texts: Array<number | string | P["I" | "O"]>): Liminal<P>
  (template: TemplateStringsArray, ...values: Array<number | string>): Liminal<P>

  adapter: Adapter<P>
  messages: Array<P["I" | "O"]>

  send: <T>(type: Type<T, never>, config?: CompleteConfig<P>) => Promise<T>
  // TODO: better name
  next: (f: (messages: Array<P["I" | "O"]>) => Array<P["I" | "O"]>) => Liminal<P>
}

export interface CompleteConfig<P extends Provider> {
  model?: P["M"]
  name?: string
  options?: P["E"]
  tools?: Record<string, Tool>
}

export function Liminal<P extends Provider>(
  adapter: Adapter<P>,
  messages_?: Array<P["I" | "O"]>,
): Liminal<P> {
  const messages = messages_ ? [...messages_] : []
  const self = Object.assign($, {
    adapter,
    messages,
    send,
    next,
  })
  return self

  function $(...texts: Array<number | string | P["I" | "O"]>): Liminal<P>
  function $(template: TemplateStringsArray, ...values: Array<number | string>): Liminal<P>
  function $(...args: Array<unknown>) {
    const [e0, ...rest] = args
    if (isTemplateStringsArray(e0)) {
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

  function send<T>(type: Type<T, never>, config?: CompleteConfig<P>): Promise<T> {
    type = adapter.transform?.(type) ?? type
    return adapter.complete({
      type,
      messages,
      model: config?.model,
      name: config?.name,
    }).then((message) => {
      messages.push(message)
      return type.deserialize(adapter.unwrapOutput(message))
    })
  }

  function next(f: (messages: Array<P["I" | "O"]>) => Array<P["I" | "O"]>): Liminal<P> {
    return Liminal(adapter, f(messages))
  }
}

// parent?: Liminal<C>
// branch: () => Liminal<C>
// serialize: () => Array<C["I" | "O"]>
// merge
