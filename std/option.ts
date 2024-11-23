import { none } from "../leaves.ts"
import { taggedUnion } from "../taggedUnion.ts"
import type { Ty } from "../Ty.ts"

export function option<S extends Ty>(some: S) {
  return taggedUnion({ some, none })`An option of specified \`some\` type.`
}
