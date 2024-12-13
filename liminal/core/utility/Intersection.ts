import type { Expand, U2I } from "../../util/mod.ts"
import * as I from "../intrinsics/mod.ts"
import type { AnyType, Type } from "../Type.ts"

export function Intersection<S extends Array<IntersectionSourceType>>(
  ...sources: Ensure<S>
): Type<Expand<U2I<S[number]["T"]>>, S[number]["P"]> {
  return I.object(
    Object.fromEntries(
      sources.flatMap((source) => Object.entries(source.declaration.args![0]!)),
    ) as never,
  )
}

export type IntersectionSourceType = AnyType<object> // TODO

type Ensure<S extends Array<IntersectionSourceType>> = [ConflictingKey<S>] extends [never] ? S
  : never

type ConflictingKey<S extends Array<IntersectionSourceType>, V extends string = never> = S extends [
  infer E0 extends IntersectionSourceType,
  ...infer ERest extends Array<IntersectionSourceType>,
] ?
    | keyof { [K in keyof E0["T"] as K extends V ? K : never]: true }
    | ConflictingKey<ERest, V | Extract<keyof E0["T"], string>>
  : never
