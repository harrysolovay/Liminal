import type { PartialType } from "./Type.ts"

// TODO: implement custom visitor / return false earlier
export function equals(a: PartialType, b: PartialType): boolean {
  return a.signature() === b.signature()
}
