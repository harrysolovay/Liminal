import { assertTySnapshot } from "test_util"
import { boolean, number, string } from "./primitives.ts"
import { union } from "./union.ts"

console.log(union(boolean, number, string).schema())

// Deno.test("union", async (t) => {
//   await assertTySnapshot(t, union(boolean, number, string))
// })
