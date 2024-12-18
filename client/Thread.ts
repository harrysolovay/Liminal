import { deserialize, type Type } from "../core/mod.ts"
import type { Adapter, AdapterConfig } from "./Adapter.ts"

export class Thread<C extends AdapterConfig> {
  #messages: Array<C["I" | "O"]>
  constructor(
    readonly adapter: Adapter<C>,
    readonly initialMessages: Array<C["I" | "O"]>,
  ) {
    this.#messages = [...initialMessages]
  }

  #queue: Promise<unknown> = Promise.resolve()
  enqueue = <T>({ type, inputs, model }: QueueConfig<T, C>): Promise<T> => {
    return this.#queue = this.#queue.then(async () => {
      const { transform } = this.adapter
      if (transform) {
        type = transform(type)
      }
      const output = await this.adapter.complete({
        type,
        messages: [...this.#messages, ...inputs ?? []],
        model,
      })
      this.#messages.push(...inputs ?? [], output)
      return deserialize(type, this.adapter.unwrapOutput(output))
    }) as never
  }
}

export interface QueueConfig<T, C extends AdapterConfig> {
  type: Type<T, never>
  inputs?: Array<C["I"]>
  model?: C["M"]
}
