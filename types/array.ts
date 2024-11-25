import { Ty } from "./Ty.ts"

export function array<E extends Ty>(element: E): Ty<Array<E["T"]>, E["P"]> {
  return Ty((ref) => ({
    type: "array",
    items: ref(element),
  }))
}
