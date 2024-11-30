import { assertEquals } from "@std/assert"
import { recombine } from "./recombine.ts"

Deno.test("recombine", async (t) => {
  await t.step("none", () => {
    assertEquals(recombine(...testArgs`A.`), "A.")
  })
  await t.step("single", () => {
    assertEquals(recombine(...testArgs`A: ${"B"}.`), "A: B.")
  })
  await t.step("multiple", () => {
    assertEquals(recombine(...testArgs`A: ${"B"}. C: ${"D"}.`), "A: B. C: D.")
  })
  await t.step("non-strings", () => {
    assertEquals(recombine(...testArgs`A: ${1}.`), "A: 1.")
  })
})

function testArgs<T>(
  template: TemplateStringsArray,
  ...values: Array<T>
): [TemplateStringsArray, Array<T>] {
  return [template, values]
}
