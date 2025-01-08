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

export interface RunContext {
  messages: Array<Message>
  model?: Model
  relays: Set<Relay>
  onMessage(message: MessageLike): Promise<void>
  ensureModel(): Model
  state(): Array<Action>
}

export async function RunContext(rune: Rune): Promise<RunContext> {
  const ctx: RunContext = {
    messages: [],
    relays: new Set(),
    onMessage,
    ensureModel() {
      assert(this.model, "No model specified. Either yield a model or set via `Thread.use`.")
      return this.model
    },
    state() {
      return [this.model, ...this.relays.values(), ...this.messages]
    },
  }

  for (const action of rune.using) {
    if (isMessageLike(action)) {
      ctx.messages.push(...normalizeMessageLike(action))
      continue
    }
    switch (action.type) {
      case "Model": {
        ctx.model = action
        break
      }
      case "Relay": {
        ctx.relays.add(action)
        break
      }
      case "Reducer": {
        ctx.messages = normalizeMessageLike(await action.reduce(ctx.messages))
        break
      }
    }
  }

  return ctx

  async function onMessage(this: RunContext, message?: MessageLike): Promise<void> {
    const normalized = normalizeMessageLike(message)
    if (normalized.length) {
      this.messages.push(...normalized)
      await Promise.all(
        this.relays.values().flatMap(
          (relay) => normalized.map(relay.handler),
        ),
      )
    }
  }
}

export async function run<N extends Rune, T>(this: N): Promise<T> {
  const rune = this as never as Type | Thread
  const ctx = await RunContext(this)

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
        return thread.use(...ctx.state()).run()
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
        next = ctx.messages.slice()
        break
      }
      case "Rune": {
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
            next = await rune.use(...ctx.state()).run()
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
