import { partition } from "@std/collections"
import { Ty } from "./Ty.ts"

export function literalUnion<M extends Array<number | string>>(
  ...members: M
): Ty<M[number], never> {
  const [strings, numbers] = partition(members, (v) => typeof v === "string")
  return Ty((description) => {
    return {
      anyOf: [
        ...strings.length
          ? [{
            type: "string",
            enum: strings,
          }]
          : [],
        ...numbers.length
          ? [{
            type: "number",
            enum: numbers,
          }]
          : [],
      ],
      description,
    }
  })
}
