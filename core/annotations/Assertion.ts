import { isTemplateStringsArray, type PromiseOr, recombine } from "../../util/mod.ts"

export type AssertLike<T = any> = (value: T) => PromiseOr<void | boolean>

export interface Assertion<T = any> {
  type: "Assertion"
  description: string
  f?: AssertLike<T>
}

export function assert<T>(
  description: string,
  f?: AssertLike<T>,
): Assertion<T>
export function assert<T>(
  template: TemplateStringsArray,
  ...values: Array<number | string>
): Assertion<T>
export function assert<T>(
  e0: string | TemplateStringsArray,
  e1: undefined | number | string | AssertLike<T>,
  ...eRest: Array<number | string>
): Assertion<T> {
  if (isTemplateStringsArray(e0)) {
    return {
      type: "Assertion",
      description: recombine(e0, [...e1 ? [e1] : [], ...eRest]),
    }
  }
  return {
    type: "Assertion",
    description: e0,
    f: e1 as never,
  }
}
