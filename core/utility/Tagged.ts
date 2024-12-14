import type { Expand } from "../../util/mod.ts"
import * as I from "../intrinsics/mod.ts"
import type { AnyType, Type } from "../Type.ts"

export type NativeTagged<
  B extends string,
  K extends string,
  F extends Record<string, AnyType>,
> = { [_ in B]: K } & { [K in keyof F]: F[K]["T"] }

export function Tagged<
  B extends string,
  K extends string,
  F extends Record<string, AnyType> = {},
  T extends NativeTagged<B, K, F> = Expand<NativeTagged<B, K, F>>,
>(
  tagKey: B,
  tag: K,
  fields?: Ensure<B, F>,
): Type<T, F[keyof F]["P"]> {
  return I.object({
    [tagKey]: I.const(I.string, tag),
    ...fields,
  }) as never
}

type Ensure<B extends string, F extends Record<string, AnyType>> = B extends keyof F ? never : F
