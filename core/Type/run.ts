import type { Action } from "../Action.ts"
import type { Message, MessageLike } from "../Message.ts"
import type { Model } from "../Model.ts"
import type { Relay } from "../Relay.ts"
import type { Type } from "../Type.ts"
import { Visitor } from "../Visitor.ts"

export function run<T>(this: Type<T, any>, model: Model): Promise<T> {
  return visit(new RunContext([model], []), this) as never
}

class RunContext {
  relays: Array<Relay> = []

  constructor(
    readonly models: Array<Model>,
    public messages: Array<Message>,
  ) {}

  onMessage = async (message: Message): Promise<void> => {
    this.messages.push(message)
    await Promise.all(this.relays.map((relay) => relay.handler(message)))
  }
}

const visit = Visitor<RunContext, unknown>({
  async thread(parentCtx, type, f, output) {
    const iter = f()
    const ctx = new RunContext([...parentCtx.models], [...parentCtx.messages])
    let model = ctx.models[ctx.models.length - 1]!
    let value: unknown
    while (true) {
      const current = await iter.next(value as never)
      value = undefined
      if (current.done) {
        if (output) {
          if (current.value === undefined) {
            const completion = await model.complete(ctx.messages)
            ctx.messages.push(completion)
            return completion.body
          }
          return current.value
        }
      }
      const action = current.value as Action

      if (!action) continue

      if (typeof action === "string") {
        ctx.onMessage({
          role: "user",
          body: action,
          created: Math.floor(new Date().getTime() / 1000),
        })
        continue
      }

      if (Array.isArray(action) || !("type" in action)) {
        normalizeMessageLike(action).map(ctx.onMessage)
        continue
      }

      switch (action.type) {
        case "Model": {
          ctx.models.push(action)
          model = action
          break
        }
        case "Relay": {
          ctx.relays.push(action)
          break
        }
        case "Complete": {
          const completion = await model.complete(ctx.messages)
          ctx.messages.push(completion)
          value = completion.body
          break
        }
        case "Reduce": {
          ctx.messages = normalizeMessageLike(await action.reducer(ctx.messages))
          break
        }
        case "Event": {
          await type.eventHandlers.reduce(
            (acc, cur) => acc.then(cur),
            Promise.resolve<unknown>(action.data),
          )
          break
        }
      }
    }
  },
  fallback() {
    return null!
  },
})

export function normalizeMessageLike(messageLike: MessageLike): Array<Message> {
  if (messageLike) {
    return Array.isArray(messageLike)
      ? messageLike.reduce<Array<Message>>(
        (acc, cur) => cur ? [...acc, ...normalizeMessageLike(cur)!] : acc,
        [],
      )
      : [
        typeof messageLike === "string"
          ? {
            role: "user",
            body: messageLike,
            created: Math.floor(new Date().getTime() / 1000),
          }
          : messageLike,
      ]
  }
  return []
}
