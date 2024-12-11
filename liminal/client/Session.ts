import type { Type } from "../core/mod.ts"

export interface Session {
  send: () => void
  make: Write
  refine: Write
  tool: <T>(
    param: Type<"object", T, never>,
    f?: (value: T, session: Session) => unknown,
  ) => Tool<T>
}

export type Write = <T>(type: Type<"object", T, never>) => Promise<T>

export interface Tool<T> {
  T: T
}
