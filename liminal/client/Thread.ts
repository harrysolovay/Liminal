import type { CompletionJSONParams } from "./Adapter.ts"
import type { Session } from "./Session.ts"

export class Thread<M, A extends unknown[]> {
  constructor(
    readonly session: Session<M, A>,
    readonly messages: Array<M>,
  ) {}

  completion = async <T>(
    { messages, description, type }: CompletionJSONParams<M, T>,
  ): Promise<T> => {
    this.messages.push(...messages)
    return await this.session.adapter.completeJSON({
      messages: this.messages,
      description,
      type,
    }).then(type.deserialize)
  }
}
