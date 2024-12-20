import { assertEquals } from "@std/assert"
import * as L from "../L.ts"
import { AnnotationContext } from "./AnnotationContext.ts"

Deno.test("AnnotationContext", async (t) => {
  await t.step("descriptions", () => {
    const A = L.string`A.`
    const aCtx = new AnnotationContext(A)
    assertEquals(aCtx.descriptions, ["A."])
    const B = A`B.`
    const bCtx = new AnnotationContext(B)
    assertEquals(bCtx.descriptions, ["A.", "B."])
    const C = B("C.")
    const cCtx = new AnnotationContext(C)
    assertEquals(cCtx.descriptions, ["A.", "B.", "C."])
    const D = C`D ${2} ${"E"}`
    const dCtx = new AnnotationContext(D)
    assertEquals(dCtx.descriptions, ["A.", "B.", "C.", "D 2 E"])
  })

  await t.step("assertions", () => {
    const A = L.string(L.assert("A"))
    const aCtx = new AnnotationContext(A)
    assertEquals(aCtx.assertionDescriptions(), ["A"])
    const B = A(L.assert("B"))
    const bCtx = new AnnotationContext(B)
    assertEquals(bCtx.assertionDescriptions(), ["A", "B"])
  })
})
