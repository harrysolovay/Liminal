import type { AnyType, Type } from "../Type.ts"
import { object, transform } from "../types.ts"

export function Tuple<E extends Array<AnyType>>(...elements: E): Type<
  { [K in keyof E]: E[K]["T"] },
  E[number]["P"]
> {
  const { length } = elements
  return transform(
    object(Object.fromEntries(Array.from({ length }, (_0, i) => [i, elements[i]!]))),
    (o) => Array.from({ length }, (_0, i) => o[i]),
  ) as never
}
