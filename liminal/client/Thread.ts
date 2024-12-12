import type { CompletionParams } from "./Adapter.ts"
import type { Session } from "./Session.ts"

export class Thread<M, A extends unknown[]> {
  constructor(
    readonly session: Session<M, A>,
    readonly messages: Array<M>,
  ) {}

  completion = async <T>(
    { messages, name, description, type }: CompletionParams<M, T>,
  ): Promise<T> => {
    this.messages.push(...messages)
    return await this.session.adapter
      .completion({
        messages: this.messages,
        name,
        description,
        type,
      })
      .then(type.deserialize)
  }
}
