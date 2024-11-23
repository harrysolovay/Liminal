import { Ty } from "./Ty.ts"

export function array<E extends Ty>(element: E): Ty<Array<E[Ty.T]>, E[Ty.P]> {
  return Ty((description, ref) => ({
    type: "array",
    description,
    items: ref(element),
  }))
}
