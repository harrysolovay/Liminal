import { partition } from "@std/collections"
import { Ty } from "./Ty.ts"

export type constantUnion<M extends Array<number | string>> = ReturnType<typeof constantUnion<M>>

export function constantUnion<M extends Array<number | string>>(
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
