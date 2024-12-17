import type { PromiseOr } from "../../util/mod.ts"

export interface Assertion<T = any, A extends Array<unknown> = Array<any>> {
  type: "Assertion"
  description: string | ((...args: A) => string)
  f?: (value: T, ...args: A) => PromiseOr<void>
  args?: A
}

export function Assertion<T>(
  description: string,
  f?: (value: T) => PromiseOr<void>,
): Assertion<T, []>
export function Assertion<T, A extends unknown[]>(
  description: (...args: A) => string,
  f?: (value: T, ...args: A) => PromiseOr<void>,
  ...args: A
): Assertion<T, A>
export function Assertion<T, A extends unknown[]>(
  description: (...args: A) => string,
  f?: (value: T, ...args: A) => PromiseOr<void>,
): (...args: A) => Assertion<T, A>
export function Assertion<T>(
  description: string | ((...args: unknown[]) => string),
  f?: (value: T, ...args: unknown[]) => PromiseOr<void>,
  ...args: unknown[]
): Assertion<T> | ((...args: unknown[]) => Assertion<T>) {
  if (typeof description === "string") {
    return {
      type: "Assertion",
      description,
      f,
    }
  }
  if (args.length) {
    return {
      type: "Assertion",
      description,
      f,
      args,
    }
  }
  return (...args) => ({
    type: "Assertion",
    description,
    f,
    args,
  })
}
