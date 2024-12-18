import type { Adapter, AdapterDescriptor } from "./Adapter.ts"
import { Thread } from "./Thread.ts"

export class Liminal<A extends AdapterDescriptor> {
  constructor(readonly adapter: Adapter<A>) {}

  thread = (...initialMessages: Array<A["I" | "O"]>): Thread<A> =>
    new Thread(this.adapter, initialMessages)
}

// const AssertionResult = L.Option(L.string`Reason behind assertion failure.`)

//   assert = async (value: unknown, statement: string): Promise<void> => {
//     const reason = await this.value(AssertionResult, {
//       name: "liminal_assert",
//       messages: [this.adapter.formatInput([`
//         Does the value satisfy the assertion?

//         ## The value:

//         \`\`\`json
//         ${JSON.stringify(value, null, 2)}
//         \`\`\

//         ## The assertion: ${statement}
//       `])],
//     })
//     if (reason) {
//       throw new AssertionError(reason)
//     }
//   }
// }
