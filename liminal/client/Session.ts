import { AssertionError } from "@std/assert"
import { type JSONTypeName, L, type Type } from "../core/mod.ts"
import type { Adapter } from "./Adapter.ts"
import { Thread } from "./Thread.ts"

export class Session<M, A extends unknown[]> {
  constructor(readonly adapter: Adapter<M, A>) {}

  thread = async (...args: A): Promise<Thread<M, A>> => {
    return new Thread(this, await this.adapter.open(...args))
  }

  value = async <T>(type: Type<JSONTypeName, T, never>, ...args: A) => {
    const thread = await this.thread(...args)
    return await thread.completion({
      name: "liminal_value",
      messages: [
        this.adapter.text("user", [
          "Generate a value based on the specified structured output schema.",
        ]),
      ],
      type,
    })
  }

  assert = async (value: unknown, statement: string, ...args: A): Promise<void> => {
    const thread = await this.thread(...args)
    const result = await thread.completion({
      name: "liminal_assert",
      messages: [this.adapter.text("user", [
        `
          Does the value satisfy the assertion?

          ## The value:

          \`\`\`json
          ${JSON.stringify(value, null, 2)}
          \`\`\

          ## The assertion: ${statement}
        `,
      ])],
      type: AssertionResult,
    })
    const maybeReason = await AssertionResult.deserialize(result)
    if (maybeReason) {
      throw new AssertionError(maybeReason)
    }
  }
}

const AssertionResult = L.Option(L.string`Reason behind assertion failure.`)
