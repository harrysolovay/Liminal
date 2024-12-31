import { isType, L, type Type } from "../core/mod.ts"
import type { Provider } from "./Adapter.ts"
import type { Thread } from "./Liminal2.ts"

export interface Tool<P extends Provider, T = any> {
  description: string
  type: Type<T, never>
  f: (param: T, thread: Thread<P>) => unknown
}

export function Tool<P extends Provider>(
  description: string,
  f: (thread: Thread<P>) => unknown,
): Tool<P, null>
export function Tool<P extends Provider, T>(
  description: string,
  type: Type<T, never>,
  f: (param: T, thread: Thread<P>) => unknown,
): Tool<P, T>
export function Tool<P extends Provider>(
  description: string,
  e1: ((param: any, thread: Thread<P>) => unknown) | Type<any, never>,
  e2?: (param: unknown, thread: Thread<P>) => unknown,
): Tool<P, any> {
  return {
    description,
    type: (isType(e1) ? e1 : L.null) as never,
    f: isType(e1) ? e2! : e1,
  }
}
