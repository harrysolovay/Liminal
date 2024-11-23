import { Ty } from "./Ty.ts"

export type constant<V extends number | string> = ReturnType<typeof constant<V>>

export function constant<V extends number | string>(value: V): Ty<V, never> {
  return Ty((description) => ({
    const: value,
    description,
  }))
}
