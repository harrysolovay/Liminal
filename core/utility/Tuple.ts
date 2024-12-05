import type { Derived } from "../Derived.ts"
import type { AnyType } from "../Type.ts"
import * as T from "../types/mod.ts"

export function Tuple<E extends Array<AnyType>>(
  ...elements: E
): Derived<{ [K in keyof E]: E[K]["T"] }, E> {
  const { length } = elements
  return T.transform(
    "Tuple",
    T.object(Object.fromEntries(Array.from({ length }, (_0, i) => [i, elements[i]!]))),
    (o) => Array.from({ length }, (_0, i) => o[i]),
  ) as never
}
