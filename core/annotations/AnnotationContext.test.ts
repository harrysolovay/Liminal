import { assertEquals } from "@std/assert"
import type { AssertTrue, IsExact, IsNever } from "conditional-type-checks"
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
    const AKey = Symbol("AKey")
    const AParam = L.Param(AKey, (value: string) => value)
    const A = L.string(AParam)(AParam("AValue"))
    const aCtx = new AnnotationContext(A)
    assertEquals(aCtx.args, {
      [AKey]: ["AValue"],
    })
    const B = A(AParam)
    type _0 = AssertTrue<IsExact<typeof B["D"], typeof AKey>>
    const BB = B(AParam("BValue"))
    type _1 = AssertTrue<IsNever<typeof BB["D"]>>
    const bbCtx = new AnnotationContext(BB)
    assertEquals(bbCtx.args, {
      [AKey]: ["BValue", "AValue"],
    })
    const C = BB(AParam("CValue"))
    type _2 = AssertTrue<IsNever<typeof C["D"]>>
    const cCtx = new AnnotationContext(C)
    assertEquals(cCtx.args, {
      [AKey]: ["CValue", "BValue", "AValue"],
    })
  })

  await t.step("description params", () => {
    const AKey = Symbol("AKey")
    const ADescriptionParam = L.DescriptionParam(AKey, (value: number) => value.toString())
    const A = L.string`A: ${ADescriptionParam}`
    type _0 = AssertTrue<IsExact<typeof A["D"], typeof AKey>>
    const AA = A(ADescriptionParam(1))
    type _1 = AssertTrue<IsNever<typeof AA["D"]>>
    const AAContext = new AnnotationContext(AA)
    assertEquals(AAContext.format(false), "A: 1")
  })
})
