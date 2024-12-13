import { AssertionError } from "@std/assert"
import { isType, L, type Type } from "../core/mod.ts"
import type { AdapterDescriptor, CompletionValueConfig } from "./Adapter.ts"
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

  tool = <T>(config: ToolConfig<T>): Tool<D> => {
    return new Tool(this, config)
  }

  text = (messages: Array<D["message"]>, model?: D["model"]): Promise<string> => {
    const assistantMessage = this.liminal.adapter.completeText(
      [this.#history(), ...messages],
      model,
    )
    this.#onMessages(...messages, assistantMessage)
    return assistantMessage.then(this.liminal.adapter.unwrapMessage)
  }

  value = async <T>(config: Type<T, never> | CompletionValueConfig<D, T>): Promise<T> => {
    let assistantMessage: D["message"]
    const typeRaw = isType(config) ? config : config.type
    const type = this.liminal.adapter.transformType?.(typeRaw) ?? typeRaw
    if (isType(config)) {
      assistantMessage = await this.liminal.adapter.completeValue({
        type,
        messages: this.#history(),
      })
      this.#onMessages(assistantMessage)
    } else {
      const { type: _type, messages, ...rest } = config
      assistantMessage = await this.liminal.adapter.completeValue({
        type,
        messages: [...this.#history(), ...messages ?? []],
        ...rest,
      })
      this.#onMessages(...messages ?? [], assistantMessage)
    }
    return type.deserialize(this.liminal.adapter.unwrapMessage(assistantMessage))
  }

  assert = async (value: unknown, statement: string): Promise<void> => {
    const reason = await this.value({
      name: "liminal_assert",
      messages: [this.liminal.adapter.formatMessage([`
        Does the value satisfy the assertion?

        ## The value:

        \`\`\`json
        ${JSON.stringify(value, null, 2)}
        \`\`\

        ## The assertion: ${statement}
      `])],
      type: AssertionResult,
    })
    if (reason) {
      throw new AssertionError(reason)
    }
  }

  #history = (): Array<D["message"]> =>
    this.history.length ? this.history : [this.liminal.adapter.defaults.opening]

  #onMessages = (...messages: Array<D["message"]>) => {
    this.history.push(
      ...this.history.length ? [] : [this.liminal.adapter.defaults.opening],
      ...messages,
    )
    this.#listeners.forEach((listener) => messages.forEach(listener.enqueue))
  }
}

const AssertionResult = L.Option(L.string`Reason behind assertion failure.`)
