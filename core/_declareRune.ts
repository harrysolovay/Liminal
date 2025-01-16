import type { Rune } from "./Rune.ts"

export function declareRune<K extends string, T>(
  kind: K,
  self: () => Rune | ((...args: any) => Rune),
  args?: Array<unknown>,
): Rune<K, T> {
  return {
    ...{} as { T: never },
    kind,
    self,
    args,
    *[Symbol.iterator]() {
      return yield this
    },
  } satisfies Rune<K, T>
}
