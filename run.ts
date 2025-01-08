import { assert } from "@std/assert"
import {
  type Action,
  isMessageLike,
  type Message,
  type MessageLike,
  type Model,
  normalizeMessageLike,
  type Relay,
} from "./Action/mod.ts"
import type { Rune } from "./Rune.ts"
import type { Thread } from "./Thread/Thread.ts"
import { deserialize } from "./Type/deserialize.ts"
import type { Type } from "./Type/mod.ts"

export class State {
  messages: Array<Message> = []
  model?: Model
  relays: Set<Relay> = new Set()
  next: unknown
  constructor(readonly rune: Type | Thread) {}

  onMessage = async (message?: MessageLike): Promise<void> => {
    const normalized = normalizeMessageLike(message)
    if (normalized.length) {
      this.messages.push(...normalized)
      await Promise.all(
        this.relays.values().flatMap(
          (relay) => normalized.map((message) => relay.handler(message)),
        ),
      )
    }
  }

  ingest = async (action: Action): Promise<void> => {
    this.next = undefined
    if (isMessageLike(action)) {
      this.messages.push(...normalizeMessageLike(action))
      return
    }
    switch (action.type) {
      case "Model": {
        this.model = action
        break
      }
      case "Reducer": {
        this.messages = normalizeMessageLike(await action.reduce(this.messages))
        break
      }
      case "Messages": {
        this.next = this.messages
        break
      }
      case "Relay": {
        this.next = this.relay(action)
        break
      }
      case "Bubble": {
        await this.rune.handlers.reduce(
          (acc, cur) => acc.then(cur),
          Promise.resolve<unknown>(value.data),
        )
        break
      }
    }
  }

  ensureModel = (): Model => {
    assert(this.model, "No model specified. Either yield a model or set via `Thread.use`.")
    return this.model
  }

  state = (): Array<Action> => [this.model, ...this.messages]

  relay = (relay: Relay): () => void => {
    this.relays.add(relay)
    return () => {
      this.relays.delete(relay)
    }
  }
}

export async function run<N extends Rune, T>(this: N): Promise<T> {
  const rune = this as never as Type | Thread
  const ctx = new State()

  if (rune.type === "Type") {
    if (rune.kind === "string") {
      ctx.onMessage(rune.description())
      const message = await ctx.ensureModel().complete(ctx.messages)
      ctx.onMessage(message)
      return message.body as never
    }
    const schema = await rune.schema()
    const message = await ctx.ensureModel().complete(ctx.messages, schema)
    ctx.onMessage(message)
    return deserialize(schema, JSON.parse(message.body)) as never
  }
  const { source } = rune
  if (Array.isArray(source)) {
    return Promise.all(
      source.map((thread) => {
        const handlers = thread.handlers.slice()
        while (handlers.length) {
          const handler = handlers.shift()!
          thread = thread.handle(handler)
        }
        return thread.prepend(...ctx.state()).run()
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
        next = ctx.messages.slice()
        break
      }
      case "Exec": {
        const { rune } = value
        switch (rune.type) {
          case "Type": {
            if (rune.kind === "string") {
              ctx.onMessage(rune.description())
              const message = await ctx.ensureModel().complete(ctx.messages)
              ctx.onMessage(message)
              next = message.body
              break
            }
            const schema = await rune.schema()
            const message = await ctx.ensureModel().complete(ctx.messages, schema)
            ctx.onMessage(message)
            next = deserialize(schema, JSON.parse(message.body)) as never
            break
          }
          case "Thread": {
            next = await rune.prepend(...ctx.state()).run()
            break
          }
        }
        break
      }
      case "Reducer": {
        ctx.messages = normalizeMessageLike(await value.reduce(ctx.messages))
        break
      }
      case "Bubble": {
        await rune.handlers.reduce(
          (acc, cur) => acc.then(cur),
          Promise.resolve<unknown>(value.data),
        )
        break
      }
    }
  }
}
