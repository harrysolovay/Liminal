import type { PromiseOr } from "../../util/mod.ts"

export interface Assert<T = any, A extends Array<unknown> = Array<any>> {
  type: "Assertion"
  description: string | ((...args: A) => string)
  f?: (value: T, ...args: A) => PromiseOr<void>
  args?: A
}

export function Assert<T>(
  description: string,
  f?: (value: T) => PromiseOr<void>,
): Assert<T, []>
export function Assert<T, A extends unknown[]>(
  description: (...args: A) => string,
  f?: (value: T, ...args: A) => PromiseOr<void>,
  ...args: A
): Assert<T, A>
export function Assert<T, A extends unknown[]>(
  description: (...args: A) => string,
  f?: (value: T, ...args: A) => PromiseOr<void>,
): (...args: A) => Assert<T, A>
export function Assert<T>(
  description: string | ((...args: unknown[]) => string),
  f?: (value: T, ...args: unknown[]) => PromiseOr<void>,
  ...args: unknown[]
): Assert<T> | ((...args: unknown[]) => Assert<T>) {
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
