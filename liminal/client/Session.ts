import { AssertionError } from "@std/assert"
import { L, type Type } from "../core/mod.ts"
import type { AdapterDescriptor, TextConfig } from "./Adapter.ts"
import type { Liminal } from "./Liminal.ts"
import { Tool, type ToolConfig } from "./Tool.ts"

export class Session<D extends AdapterDescriptor> {
  #listeners: Set<ReadableStreamDefaultController<D["message"]>> = new Set()

  constructor(
    readonly liminal: Liminal<D>,
    public history: Array<D["message"]> = [],
  ) {}

  readable = () => {
    const abort = new AbortController()
    return new ReadableStream<D["message"]>({
      start: (ctl) => {
        this.#listeners.add(ctl)
        abort.signal.addEventListener("abort", () => this.#listeners.delete(ctl))
      },
      cancel(reason) {
        abort.abort(reason)
      },
    })
  }

  tool = <T>(type: Type<T, never>, config: ToolConfig<T>): Tool<D, T> => {
    return new Tool(this, type, config)
  }

  text = (messages: Array<D["message"]>, config: TextConfig<D>): Promise<string> => {
    if (!messages.length) {
      messages = [this.liminal.adapter.defaults.opening]
    }
    const assistantMessage = this.liminal.adapter.text([this.history, ...messages], config)
    this.#onMessages(...messages, assistantMessage)
    return assistantMessage.then(this.liminal.adapter.unwrapMessage)
  }

  value = async <T>(type: Type<T, never>, config?: ValueConfig<D>): Promise<T> => {
    const { transformType } = this.liminal.adapter
    if (transformType) {
      type = transformType(type)
    }
    const messages = config?.messages?.length
      ? config.messages
      : [this.liminal.adapter.defaults.opening]
    const assistantMessage = await this.liminal.adapter.value(type, {
      messages: [...this.history, ...messages],
    })
    this.#onMessages(...messages, assistantMessage)
    return type.deserialize(this.liminal.adapter.unwrapMessage(assistantMessage))
  }

  assert = async (value: unknown, statement: string): Promise<void> => {
    const reason = await this.value(AssertionResult, {
      name: "liminal_assert",
      messages: [this.liminal.adapter.formatMessage([`
        Does the value satisfy the assertion?

        ## The value:

        \`\`\`json
        ${JSON.stringify(value, null, 2)}
        \`\`\

        ## The assertion: ${statement}
      `])],
    })
    if (reason) {
      throw new AssertionError(reason)
    }
  }

  #onMessages = (...messages: Array<D["message"]>) => {
    this.history.push(
      ...this.history.length ? [] : [this.liminal.adapter.defaults.opening],
      ...messages,
    )
    this.#listeners.forEach((listener) => messages.forEach(listener.enqueue))
  }
}

const AssertionResult = L.Option(L.string`Reason behind assertion failure.`)

export interface ValueConfig<D extends AdapterDescriptor> {
  messages?: Array<D["message"]>
  name?: string
  description?: string
  model?: D["model"]
}
