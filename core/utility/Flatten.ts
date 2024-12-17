import * as I from "../intrinsics.ts"
import type { PartialType, Type } from "../Type.ts"
import { Tuple } from "./Tuple.ts"

export function Flattened<A extends Array<PartialType<Array<unknown>>>>(
  ...sources: A
): Type<NativeFlattened<A>, A[number]["P"]> {
  return I.transform(Tuple(...sources), (value) => value.flat()) as never
}

type NativeFlattened<A extends Array<PartialType<Array<unknown>>>> = A extends
  [infer E0 extends PartialType, ...infer ERest extends PartialType[]]
  ? [...E0["T"], ...NativeFlattened<ERest>]
  : []
