import { Type } from "../Type.ts"

export function codec<T, E, T2>(
  from: Type<T, E>,
  decode: (value: T) => T2,
  encode: (value: T2) => T,
): Type<T2, E> {
  return Type({
    type: "codec",
    self() {
      return codec
    },
    args: [from, decode, encode],
  })
}
