import { deserialize, type Type } from "../core/mod.ts"
import type { Adapter, AdapterDescriptor } from "./Adapter.ts"

export class Thread<D extends AdapterDescriptor> {
  #messages: Array<D["I" | "O"]>
  constructor(
    readonly adapter: Adapter<D>,
    readonly initialMessages: Array<D["I" | "O"]>,
  ) {
    this.#messages = [...initialMessages]
  }

  #queue: Promise<unknown> = Promise.resolve()

  next = <T>({ type, inputs }: {
    type: Type<T, never>
    inputs?: Array<D["I"]>
  }): Promise<T> => {
    return this.#queue = this.#queue.then(async () => {
      const { transform } = this.adapter
      if (transform) {
        type = transform(type)
      }
      const output = await this.adapter.complete({
        type,
        messages: [...this.#messages, ...inputs ?? []],
      })
      this.#messages.push(...inputs ?? [], output)
      return deserialize(type, this.adapter.unwrapOutput(output))
    }) as never
  }
}
