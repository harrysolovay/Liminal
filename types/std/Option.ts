import { none } from "../primitives.ts"
import { taggedUnion } from "../taggedUnion.ts"
import type { Ty } from "../Ty.ts"

export function Option<S extends Ty>(Some: S): ReturnType<
  typeof taggedUnion<{
    Some: S
    None: typeof none
  }>
> {
  return taggedUnion({
    Some,
    None: none,
  })`An option of specified \`some\` type.`
}
