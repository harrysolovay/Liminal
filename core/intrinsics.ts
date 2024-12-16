import * as I from "./intrinsics/mod.ts"
import type { AnyType } from "./Type.ts"

let names: Map<Intrinsic, IntrinsicName> | undefined

export function IntrinsicName(type: AnyType): IntrinsicName {
  if (!names) {
    names = new Map(Object.entries(I).map(([typeName, type]) => [type, typeName]) as never)
  }
  const { declaration } = type
  const intrinsic = declaration.factory ?? declaration.getAtom()
  return names.get(intrinsic)!
}

export type Intrinsics = typeof I
export type IntrinsicName = keyof Intrinsics
export type Intrinsic = Intrinsics[IntrinsicName]
