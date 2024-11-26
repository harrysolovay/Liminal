import { taggedUnion } from "../taggedUnion.ts"
import type { Ty } from "../Ty.ts"

export function Option<S extends Ty>(Some: S): ReturnType<
  typeof taggedUnion<{
    Some: S
    None: null
  }>
> {
  return taggedUnion({
    Some,
    None: null,
  })`An option of specified \`some\` type.`
}
