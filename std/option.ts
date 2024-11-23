import { none } from "../core/leaves.ts"
import { taggedUnion } from "../core/taggedUnion.ts"
import type { Ty } from "../core/Ty.ts"

export type Option<S extends Ty> = ReturnType<typeof Option<S>>

export function Option<S extends Ty = Ty>(Some: S): taggedUnion<{
  Some: S
  None: none
}> {
  return taggedUnion({
    Some,
    None: none,
  })`An option of specified \`some\` type.`
}
