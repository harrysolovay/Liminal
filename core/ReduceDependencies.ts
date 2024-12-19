import type { Arg, Param } from "./annotations/mod.ts"

export type ReduceDependencies<D extends keyof any, A extends Array<unknown>> = A extends
  [infer Part0, ...infer PartRest] ? ReduceDependencies<
    Part0 extends Param<infer K> ? D | K : Part0 extends Arg<infer K> ? Exclude<D, K> : D,
    PartRest
  >
  : D
