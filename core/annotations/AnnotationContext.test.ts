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
    assertEquals(bCtx.descriptions, ["B.", "A."])
    const C = B("C.")
    const cCtx = new AnnotationContext(C)
    assertEquals(cCtx.descriptions, ["C.", "B.", "A."])
    const D = C`D ${2} ${"E"}`
    const dCtx = new AnnotationContext(D)
    assertEquals(dCtx.descriptions, ["D 2 E", "C.", "B.", "A."])
  })

  await t.step("assertions", () => {
    const A = L.string(L.assert("A"))
    const aCtx = new AnnotationContext(A)
    assertEquals(aCtx.assertionDescriptions(), ["A"])
    const B = A(L.assert("B"))
    const bCtx = new AnnotationContext(B)
    assertEquals(bCtx.assertionDescriptions(), ["B", "A"])
  })

  await t.step("params", () => {
    const AKey = Symbol()
    const AParam = L.Param(AKey, (value: string) => value)
    const A = L.string(AParam)(AParam("AValue"))
    const aCtx = new AnnotationContext(A)
    assertEquals(aCtx.args, {
      [AKey]: ["AValue"],
    })
    const B = A(AParam)(AParam("BValue"))
    const bCtx = new AnnotationContext(B)
    assertEquals(bCtx.args, {
      [AKey]: ["BValue", "AValue"],
    })
  })
})
