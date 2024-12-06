import type { AnyType, Type } from "./Type.ts"

export type Derived<
  T,
  X extends Array<AnyType>,
  P extends keyof any = never,
> = [Type<T, P | X[number]["P"]>][0]
