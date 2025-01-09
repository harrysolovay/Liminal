import type { Action } from "./Action/Action.ts"
import type { Message } from "./Action/Message.ts"
import { isMessageLike, type MessageLike, normalizeMessageLike } from "./Action/MessageLike.ts"
import type { Model } from "./Action/Model.ts"
import type { Relayer } from "./Action/Relayer.ts"
import type { Rune } from "./Rune.ts"

export class Context {
  static async make(rune: Rune, parent?: Context): Promise<Context> {
    const ctx = new Context(parent?.model, [...parent?.messages ?? []])
    for (const action of rune.prelude) {
      await ctx.apply(action)
    }
    return ctx
  }

  constructor(
    public model?: Model,
    public messages: Array<Message> = [],
    readonly relayers: Set<Relayer> = new Set(),
    public next?: unknown,
  ) {}

  onMessage = async (messageLike: MessageLike): Promise<void> => {
    const messages = normalizeMessageLike(messageLike)
    this.messages.push(...messages)
    await Promise.all(this.relayers.values().flatMap((relayer) => messages.map(relayer.relay)))
  }

  apply = async (action: Action): Promise<void> => {
    if (isMessageLike(action)) {
      this.onMessage(action)
      return
    }
    switch (action.action) {
      case "Model": {
        this.model = action
        break
      }
      case "Messages": {
        this.next = [...this.messages]
        break
      }
      case "Reducer": {
        const content = await action.reduce(this.messages)
        this.messages = [{
          role: "reducer",
          created: new Date(),
          ...content,
        }]
        break
      }
      case "Relayer": {
        this.relayers.add(action)
        this.next = () => {
          this.relayers.delete(action)
        }
        break
      }
      case "Rune": {
        this.next = await action.consume(this)
        break
      }
    }
  }
}
