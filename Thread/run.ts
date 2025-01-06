import { type Message, type Model, normalizeMessageLike, type Relay } from "../Action/mod.ts"
import type { Thread } from "./Thread.ts"

export class RunContext {
  relays: Array<Relay> = []
  constructor(
    public model: Model,
    public messages: Array<Message> = [],
  ) {}

  onMessage = async (message: Message): Promise<void> => {
    this.messages.push(message)
    await Promise.all(this.relays.map((relay) => relay.handler(message)))
  }
}

export async function run<T>(
  this: Thread,
  model: Model,
  ctx: RunContext = new RunContext(model),
): Promise<T> {
  const iter = this.f()
  let next: unknown
  while (true) {
    const { done, value } = await iter.next(next as never)

    next = undefined

    if (done) {
      return value
    }

    if (!value) {
      continue
    }

    if (typeof value === "string") {
      ctx.onMessage({
        role: "user",
        body: value,
        created: Math.floor(new Date().getTime() / 1000),
      })
      continue
    }

    if (Array.isArray(value) || !("type" in value)) {
      normalizeMessageLike(value).forEach(ctx.onMessage)
      continue
    }

    switch (value.type) {
      case "Model": {
        ctx.model = value
        break
      }
      case "Relay": {
        ctx.relays.push(value)
        break
      }
      case "Task": {
        const { node } = value
        switch (node.type) {
          case "Type": {
            const message = await ctx.model.complete(ctx.messages)
            ctx.onMessage(message)
            next = message.body
            break
          }
          case "Thread": {
            next = await node.run(ctx.model, new RunContext(ctx.model, [...ctx.messages]))
            break
          }
        }
        break
      }
      case "Reduce": {
        ctx.messages = normalizeMessageLike(await value.reducer(ctx.messages))
        break
      }
      case "Event": {
        await this.handlers.reduce(
          (acc, cur) => acc.then(cur),
          Promise.resolve<unknown>(value.data),
        )
        break
      }
    }
  }
}
