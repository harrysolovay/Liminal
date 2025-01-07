import { type Message, type Model, normalizeMessageLike, type Relay } from "../Action/mod.ts"
import { T } from "../Type/mod.ts"
import { Schema } from "../Type/Schema.ts"
import type { Thread } from "./Thread.ts"

export class RunContext {
  relays: Set<Relay> = new Set()
  constructor(
    public model: Model,
    public messages: Array<Message> = [],
  ) {}

  onMessage = async (message: Message): Promise<void> => {
    this.messages.push(message)
    await Promise.all(this.relays.values().map((relay) => relay.handler(message)))
  }

  clone(): RunContext {
    return new RunContext(this.model, [...this.messages])
  }
}

export async function run<T>(
  this: Thread,
  model: Model,
  ctx: RunContext = new RunContext(model),
): Promise<T> {
  const { source } = this
  if (Array.isArray(source)) {
    return Promise.all(
      source.map((thread) => {
        const handlers = [...this.handlers]
        while (handlers.length) {
          const handler = handlers.shift()!
          thread = thread.handle(handler)
        }
        return thread.run(model, ctx.clone())
      }),
    ) as never
  }
  const iter = source()
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
        ctx.relays.add(value)
        next = () => {
          ctx.relays.delete(value)
        }
        break
      }
      case "Messages": {
        next = [...ctx.messages]
        break
      }
      case "Node": {
        let { node } = value
        switch (node.type) {
          case "Type": {
            const {} = Schema(node)
            if (!(node.kind === "string" || node.kind === "object")) {
              node = T.object({ root: node })
            }
            const schema_ = node.kind !== "string" ? schema(node, schemaCtx) : undefined
            console.log(schema_)
            const message = await ctx.model.complete(ctx.messages, schema_)
            ctx.onMessage(message)
            next = message.body
            break
          }
          case "Thread": {
            next = await node.run(ctx.model, ctx.clone())
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
