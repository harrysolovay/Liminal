import { type AnyType, T, type Type } from "../mod.ts"

export function Tuple<E extends Array<AnyType>>(...elements: E): Type<
  { [K in keyof E]: E[K]["T"] },
  E[number]["P"]
> {
  const { length } = elements
  return T.transform(
    "Tuple",
    T.object(Object.fromEntries(Array.from({ length }, (_0, i) => [i, elements[i]!]))),
    (o) => Array.from({ length }, (_0, i) => o[i]),
  ) as never
}
