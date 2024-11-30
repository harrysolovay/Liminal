import { assertTypeSnapshot } from "testing"
import { number } from "./number.ts"
import { object } from "./object.ts"
import { transform } from "./transform.ts"

Deno.test("transform", async (t) => {
  await assertTypeSnapshot(
    t,
    transform(
      "Coordinates",
      object({
        latitude: number,
        longitude: number,
      }),
      ({ latitude, longitude }) => [latitude, longitude],
    ),
  )
})
