import { assertSnapshot } from "@std/testing/snapshot"
import * as T from "../mod.ts"

Deno.test("No Variant Values", async (t) => {
  const Inner = T.union(
    "Inner description",
    [
      T.literal(undefined, "A"),
      T.literal(undefined, "B"),
    ],
  )
  const Root = T.object("Root description", { inner: Inner })
  await assertSnapshot(t, T.schema({ Root, Inner }, "Root"))
})

Deno.test("Variant Values", async (t) => {
  const Inner = T.union(
    "Inner description",
    [
      T.object(
        "A description",
        {
          type: T.literal(undefined, "A"),
          value: T.number(),
        },
      ),
      T.object(
        "B description",
        {
          type: T.literal(undefined, "B"),
          value: T.string(),
        },
      ),
      T.object(
        "C",
        { type: T.literal(undefined, "C") },
      ),
    ],
  )
  const Root = T.object("Root Description", { inner: Inner })
  await assertSnapshot(t, T.schema({ Root, Inner }, "Root"))
})
