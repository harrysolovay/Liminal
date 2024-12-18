import type { PromiseOr } from "../../util/mod.ts"

export interface Assertion<T = any> {
  type: "Assertion"
  description: string
  f?: (value: T) => PromiseOr<void>
}

export function Assertion<T>(
  description: string,
  f?: (value: T) => PromiseOr<void>,
): Assertion<T> {
  return {
    type: "Assertion",
    description,
    f,
  }
}
