import { AssertionError } from "@std/assert"
import { deserialize, L, type Type } from "../core/mod.ts"
import type { Adapter, AdapterDescriptor, TextConfig, ValueConfig } from "./Adapter.ts"
import { Tool, type ToolConfig } from "./Tool.ts"

export class Liminal<D extends AdapterDescriptor = AdapterDescriptor> {
  constructor(readonly adapter: Adapter<D>, public history: Array<D["I" | "O"]> = []) {}

  #completions: Set<ReadableStreamDefaultController<D["completion"]>> = new Set()
  completions = (): ReadableStream<D["completion"]> => {
    const abort = new AbortController()
    return new ReadableStream({
      start: (ctl) => {
        this.#completions.add(ctl)
        abort.signal.addEventListener("abort", () => this.#completions.delete(ctl))
      },
      cancel(reason) {
        abort.abort(reason)
      },
    })
  }

  #messages: Set<ReadableStreamDefaultController<D["I" | "O"]>> = new Set()
  messages = (): ReadableStream<D["I" | "O"]> => {
    const abort = new AbortController()
    return new ReadableStream({
      start: (ctl) => {
        this.#messages.add(ctl)
        abort.signal.addEventListener("abort", () => this.#messages.delete(ctl))
      },
      cancel(reason) {
        abort.abort(reason)
      },
    })
  }

  #tools: Set<Tool<D, unknown>> = new Set()
  tool = <T>(type: Type<T>, config: ToolConfig<T>): Tool<D, T> => {
    const tool = new Tool(this, type, config)
    this.#tools.add(tool)
    config.signal?.addEventListener("abort", () => {
      this.#tools.delete(tool)
    })
    return tool
  }

  text = async (messages: Array<D["I"]>, config?: TextConfig<D>): Promise<string> => {
    if (!messages.length) {
      messages = [this.adapter.defaults.opening]
    }
    const completion = this.adapter.text([...this.history, ...messages], config)
    const message = await completion.then(this.adapter.unwrapOutput)
    this.#onMessages(...messages, completion)
    return this.adapter.unwrapRaw(message)
  }

  type = (_messages: Array<D["I"]>, _config?: TextConfig<D>): Promise<Type<unknown>> => {
    throw 0
  }

  migration = (
    _type: Type<unknown>,
    _messages: Array<D["I"]>,
    _config?: TextConfig<D>,
  ): Promise<L.MetaTypeMigration<never>["T"]> => {
    throw 0
  }

  // TODO: disallow `O` messages.
  value = async <T>(type: Type<T>, config?: ValueConfig<D>): Promise<T> => {
    type = L.transform(L.Tuple(type), ([e]) => e)
    const messages = config?.messages?.length
      ? config.messages
      : [this.adapter.defaults.opening]
    const completion = await this.adapter.value(type, {
      messages: [...this.history, ...messages],
    })
    const output = this.adapter.unwrapOutput(completion)
    this.#onMessages(...messages, output)
    return deserialize(type, this.adapter.unwrapRaw(output))
  }

  assert = async (value: unknown, statement: string): Promise<void> => {
    const reason = await this.value(AssertionResult, {
      name: "liminal_assert",
      messages: [this.adapter.formatInput([`
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

  #onMessages = (...messages: Array<D["I" | "O"]>) => {
    this.history.push(
      ...this.history.length ? [] : [this.adapter.defaults.opening],
      ...messages,
    )
    this.#messages.forEach((listener) => messages.forEach(listener.enqueue))
  }
}

const AssertionResult = L.Option(L.string`Reason behind assertion failure.`)
