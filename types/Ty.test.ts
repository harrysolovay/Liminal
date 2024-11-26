import { assertEquals } from "@std/assert"
import { assertTySnapshot } from "test_util"
import { SubschemaFactory, Ty } from "./Ty.ts"

export const any = Ty<unknown, never, true>(() => ({
  type: ["string", "number", "object", "array", "boolean", "null"],
}), true)

Deno.test("Ty", async (t) => {
  await assertTySnapshot(t, any)
})

const ref = SubschemaFactory({})

Deno.test("context chaining", () => {
  const a = any`A.`
  assertEquals(ref(a).description, "A.")

  const b = a`B.`
  assertEquals(ref(b).description, "B. A.")

  const c = b`C.`
  assertEquals(ref(c).description, "C. B. A.")
})

Deno.test("numeric parameter key", () => {
  const t = any`Arg: ${1}.`
  assertEquals(ref(t.fill({ 1: "value" })).description, "Arg: value.")
})

Deno.test("string parameter key", () => {
  const t = any`Arg: ${"P"}.`
  assertEquals(ref(t.fill({ P: "value" })).description, "Arg: value.")
})

Deno.test("symbol parameter key", () => {
  const sym = Symbol()
  const t = any`Arg: ${sym}.`
  assertEquals(ref(t.fill({ [sym]: "value" })).description, "Arg: value.")
})

Deno.test("parameterized with chaining", () => {
  const a = any`a: ${"A"}.`
  const b = a`b: ${"B"}.`
  const c = b`c: ${"C"}.`
  const d = c.fill({ A: "A", B: "B", C: "C" })
  assertEquals(ref(d).description, "c: C. b: B. a: A.")
})
