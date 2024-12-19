import { AssertionError } from "@std/assert"
import { deserialize, isType, L, type Type } from "../core/mod.ts"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { recombine } from "../util/mod.ts"
import type { Adapter, AdapterConfig } from "./Adapter.ts"

export interface Liminal<C extends AdapterConfig> {
  <T>(type: Type<T, never>, config?: SendConfig<C>): Promise<T>
  (...texts: Array<number | string | C["I" | "O"]>): Liminal<C>
  (template: TemplateStringsArray, ...values: Array<number | string>): Liminal<C>

  adapter: Adapter<C>
  // parent?: Liminal<C>
  messages: Array<C["I" | "O"]>

  // branch: () => Liminal<C>
  // serialize: () => Array<C["I" | "O"]>

  assert: (value: unknown, statement: string) => Promise<void>
}

export type SendConfig<C extends AdapterConfig> =
  & {
    model?: C["M"]
    name?: string
  }
  & ([C["E"]] extends [never] ? {} : {
    options?: C["E"]
  })

export function Liminal<C extends AdapterConfig>(adapter: Adapter<C>): Liminal<C> {
  const messages: Array<C["I" | "O"]> = []
  return Object.assign(send, {
    adapter,
    messages,
    assert: async (value: unknown, statement: string) => {
      messages.push(adapter.formatInput(`
        Does the value satisfy the assertion?

        ## The value:

        \`\`\`json
        ${JSON.stringify(value, null, 2)}
        \`\`\

        ## The assertion: ${statement}
      `))
      const maybeReason = await send(AssertionResult)
      if (maybeReason) {
        throw new AssertionError(maybeReason as string)
      }
    },
  } as never)

  async function send(...args: unknown[]) {
    const [e0, ...rest] = args
    if (isType(e0)) {
      const type = (adapter.transform?.(e0 as never) ?? e0) as Type<unknown, never>
      const [maybeConfig] = rest
      const message = await adapter.complete({
        type,
        messages,
        ...(typeof maybeConfig === "object" && maybeConfig !== null)
          ? {
            model: "model" in maybeConfig ? maybeConfig.model as string : undefined,
            name: "name" in maybeConfig ? maybeConfig.name as string : undefined,
          }
          : {},
      })
      messages.push(message)
      const raw = adapter.unwrapOutput(message)
      return deserialize(type, raw)
    }
    if (isTemplateStringsArray(e0)) {
      messages.push(adapter.formatInput(recombine(e0, rest)))
    } else {
      args.forEach((arg) => {
        if (typeof arg === "string") {
          messages.push(adapter.formatInput(arg))
        } else if (typeof arg === "number") {
          messages.push(adapter.formatInput(arg.toString()))
        } else {
          messages.push(arg)
        }
      })
    }
  }
}

export namespace Liminal {
  export function merge<C extends AdapterConfig>(...liminals: Array<Liminal<C>>): Liminal<C> {
    throw 0
  }
}

const AssertionResult = L.Option(L.string`Reason behind assertion failure.`)
