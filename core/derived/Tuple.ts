import type { Derived } from "../Derived.ts"
import type { AnyType } from "../Type.ts"
import { object, transform } from "../types.ts"

export function Tuple<E extends Array<AnyType>>(
  ...elements: E
): Derived<{ [K in keyof E]: E[K]["T"] }, E> {
  const { length } = elements
  return transform(
    "Tuple",
    object(Object.fromEntries(Array.from({ length }, (_0, i) => [i, elements[i]!]))),
    (o) => Array.from({ length }, (_0, i) => o[i]),
  ) as never
}
