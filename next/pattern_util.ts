import type { Type, TypeMetadata } from "./Type.ts"

export type Derive<
  X extends Type,
  T,
  P extends keyof any,
  M extends TypeMetadata,
> = Type<T, X["P"] | P, M>
