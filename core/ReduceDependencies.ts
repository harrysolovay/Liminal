import type { Arg, Param } from "./annotations/mod.ts"

// TODO: disallow args with no corresponding params?
export type ReduceDependencies<D extends symbol, A extends Array<unknown>> = A extends
  [infer Part0, ...infer PartRest] ? ReduceDependencies<
    Part0 extends Param<infer K> ? D | K : Part0 extends Arg<infer K> ? Exclude<D, K> : D,
    PartRest
  >
  : D
