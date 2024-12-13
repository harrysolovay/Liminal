import { AssertionError } from "@std/assert"
import { L, type Type } from "../core/mod.ts"
import type { Adapter, AdapterDescriptor, CompletionValueConfig } from "./Adapter.ts"
import { Session } from "./Session.ts"

export class Liminal<D extends AdapterDescriptor> {
  constructor(readonly adapter: Adapter<D>) {}

  session = async (id?: string): Promise<Session<D>> => {
    const messages = await this.adapter.loadSession(id)
    return new Session(this, id ?? crypto.randomUUID(), messages, id ? messages.length - 1 : 0)
  }

  text = (messages: Array<D["message"]>, model?: D["model"]) =>
    this.adapter.completeText(messages, model).then(this.adapter.unwrapMessage)

  value = <T>(config: Type<T, never> | CompletionValueConfig<D, T>): Promise<T> =>
    this.adapter
      .completeValue(typeof config === "function" ? { type: config } : config)
      .then(this.adapter.unwrapMessage)
      .then(JSON.parse)
      .then(typeof config === "function" ? config.deserialize : config.type.deserialize)

  assert = async (value: unknown, statement: string): Promise<void> => {
    const reason = await this.value({
      name: "liminal_assert",
      messages: [this.adapter.formatMessage([`
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
}

const AssertionResult = L.Option(L.string`Reason behind assertion failure.`)
