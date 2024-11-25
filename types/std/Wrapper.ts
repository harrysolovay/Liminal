import type { Ty } from "../mod.ts"
import { object } from "../object.ts"

export function Wrapper<X extends Ty>(value: X): ReturnType<typeof object<{ value: X }>> {
  return object({ value })
}
