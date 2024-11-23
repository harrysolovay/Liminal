import { Ty } from "./Ty.ts"

export function constant<V extends number | string>(value: V): Ty<V, never> {
  return Ty((description) => ({
    const: value,
    description,
  }))
}
