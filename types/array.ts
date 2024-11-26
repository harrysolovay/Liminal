import { Ty } from "./Ty.ts"

export function array<E extends Ty>(element: E): Ty<Array<E["T"]>, E["P"], false> {
  return Ty(
    (subschema) => ({
      type: "array",
      items: subschema(element),
    }),
    false,
    (value) => value.map(element[""].transform),
  )
}
