import { Rune } from "../Rune.ts"
import { consumeType } from "./_common.ts"

export function deferred<T, E>(get: () => Rune<T, E>): Rune<T, E> {
  return Rune({
    kind: "deferred",
    self: () => deferred,
    consume: consumeType,
    args: [get],
  })
}
