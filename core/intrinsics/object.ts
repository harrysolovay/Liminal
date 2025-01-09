import { Rune } from "../Rune.ts"
import { consumeType } from "./_common.ts"

export function object<F extends Record<string, Rune>>(
  fields: F,
): Rune<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["E"]> {
  return Rune({
    kind: "object",
    self: () => object,
    args: [fields],
    consume: consumeType,
  })
}
