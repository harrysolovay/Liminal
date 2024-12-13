import { AssertionError } from "@std/assert"
import { L } from "../core/mod.ts"
import type { Adapter, AdapterDescriptor, CompletionValueConfig } from "./Adapter.ts"
import { Thread } from "./Thread.ts"

export class Liminal<D extends AdapterDescriptor> {
  constructor(readonly adapter: Adapter<D>) {}

  thread = async (id?: string): Promise<Thread<D>> => {
    const messages = await this.adapter.loadThread(id)
    return new Thread(this, id ?? crypto.randomUUID(), messages, id ? messages.length - 1 : 0)
  }

  text = (messages: Array<D["message"]>, model?: D["model"]) =>
    this.adapter.completeText(messages, model).then(this.adapter.unwrapMessage)

  value = <T>(
    { messages, name, description, type, model }: CompletionValueConfig<D, T>,
  ): Promise<T> => {
    return this.adapter
      .completeValue({
        messages,
        name,
        description,
        type,
        model,
      })
      .then(this.adapter.unwrapMessage)
      .then(JSON.parse)
      .then(type.deserialize)
  }

  assert = async (value: unknown, statement: string): Promise<void> => {
    const thread = await this.thread()
    const result = await thread.json({
      name: "liminal_assertion",
      messages: [this.adapter.formatMessage([
        `
          Does the value satisfy the assertion?

          ## The value:

          \`\`\`json
          ${JSON.stringify(value, null, 2)}
          \`\`\

          ## The assertion: ${statement}
        `,
      ])],
      type: AssertionResult,
    })
    const maybeReason = await AssertionResult.deserialize(result)
    if (maybeReason) {
      throw new AssertionError(maybeReason)
    }
  }
}

const AssertionResult = L.Option(L.string`Reason behind assertion failure.`)
