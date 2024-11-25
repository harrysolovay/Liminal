import { Ty } from "./Ty.ts"

export function constant<V extends number | string>(value: V): Ty<V, never, false> {
  return Ty(() => ({
    const: value,
  }), false)
}
