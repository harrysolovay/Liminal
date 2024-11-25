import { partition } from "@std/collections"
import { Ty } from "./Ty.ts"

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
