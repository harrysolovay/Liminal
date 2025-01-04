import type { ArrayOfLength } from "../../util/mod.ts"
import * as I from "../intrinsics/mod.ts"
import type { AnyType, Type } from "../Type.ts"

export function Tuple<M extends Array<AnyType>>(
  ...members: M
): Type<{ [I in keyof M]: M[I]["T"] }, M[number]["E"]> {
  return TupleBase(members.map((type, i) => [i, type]))
}

export function TupleN<T, E, N extends number>(
  member: Type<T, E>,
  length: N,
): Type<ArrayOfLength<T, N>, E> {
  return TupleBase(Array.from({ length }, (_0, i) => [i, member]))
}

function TupleBase(membersEntries: Array<[number, AnyType]>) {
  return I.codec(
    I.object(Object.fromEntries(membersEntries)),
    Object.values,
    (value) => Object.fromEntries(Object.entries(value)),
  ) as never
}
