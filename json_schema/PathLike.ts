import * as I from "../core/intrinsics/mod.ts"
import type { Type } from "../core/Type.ts"

export type PathLike = [number | string | Array<number | string>][0]

export const PathLike: Type<PathLike> = I.union(
  I.integer,
  I.string,
  I.array(I.union(I.integer, I.string)),
)
