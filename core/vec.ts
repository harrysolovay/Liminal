import { Ty } from "./Ty.ts"

export type vec<E extends Ty> = ReturnType<typeof vec<E>>

export function vec<E extends Ty>(element: E): Ty<Array<E[Ty.T]>, E[Ty.P]> {
  return Ty((description, ref) => ({
    type: "array",
    description,
    items: ref(element),
  }))
}
