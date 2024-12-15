import { AssertionError } from "@std/assert"
import { L, type Type } from "../core/mod.ts"
import type { AdapterDescriptor, TextConfig, ValueConfig } from "./Adapter.ts"
import type { Liminal } from "./Liminal.ts"
import { Tool, type ToolConfig } from "./Tool.ts"

export class Session<D extends AdapterDescriptor> {
  #listeners: Set<ReadableStreamDefaultController<D["message"]>> = new Set()
  #tools: Set<Tool<D, unknown>> = new Set()

  constructor(
    readonly liminal: Liminal<D>,
    public history: Array<D["message"]> = [],
  ) {}

  readable = (): ReadableStream<D["message"]> => {
    const abort = new AbortController()
    return new ReadableStream({
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
    const tool = new Tool(this, type, config)
    this.#tools.add(tool)
    config.signal?.addEventListener("abort", () => {
      this.#tools.delete(tool)
    })
    return tool
  }

  text = async (messages: Array<D["message"]>, config: TextConfig<D>): Promise<string> => {
    if (!messages.length) {
      messages = [this.liminal.adapter.defaults.opening]
    }
    const completion = this.liminal.adapter.text([this.history, ...messages], config)
    this.liminal.adapter.hook?.(completion)
    const message = await completion.then(this.liminal.adapter.unwrapMessage)
    this.#onMessages(...messages, completion)
    return this.liminal.adapter.unwrapContent(message)
  }

  value = async <T>(type: Type<T, never>, config?: ValueConfig<D>): Promise<T> => {
    const { transformType } = this.liminal.adapter
    if (transformType) {
      type = transformType(type)
    }
    const messages = config?.messages?.length
      ? config.messages
      : [this.liminal.adapter.defaults.opening]
    const completion = await this.liminal.adapter.value(type, {
      messages: [...this.history, ...messages],
    })
    this.liminal.adapter.hook?.(completion)
    const message = this.liminal.adapter.unwrapMessage(completion)
    this.#onMessages(...messages, message)
    return type.deserialize(this.liminal.adapter.unwrapContent(message))
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
