import type { Expand, U2I } from "../../util/mod.ts"
import * as I from "../intrinsics.ts"
import type { PartialType, Type } from "../Type.ts"

export function Intersection<S extends Array<PartialType>>(
  ...sources: Ensure<S>
): Type<Expand<U2I<S[number]["T"]>>, S[number]["P"]> {
  return I.object(
    Object.fromEntries(
      sources.flatMap((source) => Object.entries(source.declaration.args![0]!)),
    ) as never,
  )
}

type Ensure<S extends Array<PartialType>> = [ConflictingKey<S>] extends [never] ? S
  : never

type ConflictingKey<S extends Array<PartialType>, V extends string = never> = S extends [
  infer E0 extends PartialType,
  ...infer ERest extends Array<PartialType>,
] ?
    | keyof { [K in keyof E0["T"] as K extends V ? K : never]: true }
    | ConflictingKey<ERest, V | Extract<keyof E0["T"], string>>
  : never
