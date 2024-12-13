import * as I from "../intrinsics/mod.ts"
import type { Type } from "../Type.ts"

export type PathLike = [number | string | Array<number | string>][0]

export const PathLike: Type<PathLike, never> = I.union(
  I.integer,
  I.string,
  I.array(I.union(I.integer, I.string)),
)
