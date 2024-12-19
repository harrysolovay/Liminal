export {}

// import { AssertionError } from "@std/assert"
// import { L } from "../core/mod.ts"
// import type { Adapter, AdapterConfig } from "./Adapter.ts"
// import { Thread } from "./Thread.ts"

// export class Liminal<C extends AdapterConfig> {
//   constructor(readonly adapter: Adapter<C>) {}

//   thread = (...initialMessages: Array<C["I" | "O"]>): Thread<C> =>
//     new Thread(this.adapter, initialMessages)

//   assert = async (value: unknown, statement: string, model?: C["M"]): Promise<void> => {
//     const reason = await this.thread().enqueue({
//       type: AssertionResult,
//       inputs: [this.adapter.formatInput(`
//         Does the value satisfy the assertion?

//         ## The value:

//         \`\`\`json
//         ${JSON.stringify(value, null, 2)}
//         \`\`\

//         ## The assertion: ${statement}
//       `)],
//       model,
//       name: "liminal_assert",
//     })
//     if (reason) {
//       throw new AssertionError(reason)
//     }
//   }
// }

// const AssertionResult = L.Option(L.string`Reason behind assertion failure.`)
