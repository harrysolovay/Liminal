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

Deno.test("context placeholding with number", () => {
  const t = any`Placeheld ${1}.`
  assertEquals(ref(t.fill({ 1: "value" })).description, "Placeheld value.")
})

Deno.test("context placeholding with string", () => {
  const t = any`Placeheld ${"P"}.`
  assertEquals(ref(t.fill({ P: "value" })).description, "Placeheld value.")
})

Deno.test("context placeholding with symbol", () => {
  const sym = Symbol()
  const t = any`Placeheld ${sym}.`
  assertEquals(ref(t.fill({ [sym]: "value" })).description, "Placeheld value.")
})

Deno.test("context placeholding with chaining", () => {
  const a = any`a: ${"A"}.`
  const b = a`b: ${"B"}.`
  const c = b`c: ${"C"}.`
  const d = c.fill({ A: "A", B: "B", C: "C" })
  assertEquals(ref(d).description, "c: C. b: B. a: A.")
})
