import { partition } from "@std/collections"
import { Ty } from "./Ty.ts"

// TODO: use single `enum` type in cases where there aren't both numbers and strings
export function constantUnion<M extends Array<number | string>>(
  ...members: M
): Ty<M[number], never, false> {
  const [strings, numbers] = partition(members, (v) => typeof v === "string")
  return Ty(() => ({
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
  }), false)
}
