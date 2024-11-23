import { Ty } from "./Ty.ts"

export function literal<V extends number | string>(value: V): Ty<V> {
  return Ty((description) => ({
    const: value,
    description,
  }))
}
