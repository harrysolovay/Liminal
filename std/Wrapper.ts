import { struct, type Ty } from "../core/mod.ts"

export type Wrapper<X extends Ty = Ty> = ReturnType<typeof Wrapper<X>>

export function Wrapper<X extends Ty>(value: X): struct<{ value: X }> {
  return struct({ value })
}
