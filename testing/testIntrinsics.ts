import type * as I from "../core/intrinsics/mod.ts"
import type { PromiseOr } from "../util/mod.ts"

type I = typeof I

export function testIntrinsics<A extends unknown[]>(
  name: string,
  f: (t: Deno.TestContext, ...args: A) => PromiseOr<void>,
  argSets: { [K in keyof I]: Array<A> },
) {
  Deno.test(name, async (t) => {
    for (const [typeName, sets] of Object.entries(argSets)) {
      await t.step(typeName, async (t) => {
        for (const args of sets) {
          await f(t, ...args)
        }
      })
    }
  })
}
