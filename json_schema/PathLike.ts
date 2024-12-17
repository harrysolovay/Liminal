import { L, type Type } from "../core/mod.ts"

export type PathLike = [number | string | Array<number | string>][0]

export const PathLike: Type<PathLike> = L.union(
  L.integer,
  L.string,
  L.array(L.union(L.integer, L.string)),
)
