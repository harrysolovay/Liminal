import { none } from "../core/leaves.ts"
import { taggedUnion } from "../core/taggedUnion.ts"
import type { Ty } from "../core/Ty.ts"

export type Option<S extends Ty> = ReturnType<typeof Option<S>>

export function Option<S extends Ty>(Some: S): taggedUnion<{
  Some: S
  None: none<never>
}> {
  // TODO: There should be no need to supply the following type arg.
  //       Determine where inference isn't smart enough to avoid widening `none`'s `P` to `string`.
  return taggedUnion<{
    Some: S
    None: none<never>
  }>({
    Some,
    None: none,
  })`An option of specified \`some\` type.`
}
