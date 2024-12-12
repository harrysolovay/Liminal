import { AssertionError } from "@std/assert"
import { L, type Type } from "../core/mod.ts"
import type { SessionConfig } from "./SessionConfig.ts"

export class Session<M, N extends string> {
  constructor(
    readonly config: SessionConfig<M, N>,
    readonly threads: WeakSet<Thread<M, N>> = new WeakSet(),
  ) {}

  thread = (system?: string): Thread<M, N> => {
    const thread = new Thread(
      this,
      system ? [this.config.toMessage(system, "system")] : [],
    )
    this.threads.add(thread)
    return thread
  }

  completion: CreateCompletion<M, N> = (
    name,
    description,
    type,
    messages,
    model,
  ) =>
    this.config.completion(
      name,
      description,
      type.toJSON(),
      messages.length ? messages : [this.config.toMessage(this.config.defaultSystemText, "user")],
      model ?? this.config.defaultModel,
    ) as never

  value = async <T>(type: Type<"object", T, never>, model: N) => {
    const thread = this.thread()
    const result = await thread.completion("animal", undefined, type, [], model)
    return result
  }

  assert = async (value: unknown, statement: string, model?: N): Promise<void> => {
    const result = await this.config.completion(
      "assert",
      "reflect on the provided value+assertion pair.",
      AssertionResult.toJSON(),
      [
        this.config.toMessage(
          `
            Does the value satisfy the assertion?

            ## The value:

            \`\`\`json
            ${JSON.stringify(value, null, 2)}
            \`\`\

            ## The assertion: ${statement}
          `,
          "user",
        ),
      ],
      model ?? this.config.defaultModel,
    )
    const maybeReason = await AssertionResult.deserialize(result)
    if (maybeReason) {
      throw new AssertionError(maybeReason)
    }
  }
}

const AssertionResult = L.Option(L.string`Reason behind assertion failure.`)

export class Thread<M, N extends string> {
  constructor(
    readonly session: Session<M, N>,
    readonly messages: Array<M> = [],
  ) {}

  completion: CreateCompletion<M, N> = (name, description, type, messages, model) => {
    this.messages.push(...messages)
    return this.session.completion(
      name,
      description,
      type,
      messages,
      model,
    )
  }
}

export type CreateCompletion<M, N extends string> = <T>(
  name: string,
  description: undefined | string,
  type: Type<"object", T, never>,
  messages: Array<M>,
  model?: N,
) => Promise<T>
