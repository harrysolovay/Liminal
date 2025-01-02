import { isTemplateStringsArray, recombine } from "../util/mod.ts"
import type { Assertion, AssertLike } from "./Type.ts"

export function assertion<T>(
  description: string,
  f?: AssertLike<T>,
): Assertion<T>
export function assertion<T>(
  template: TemplateStringsArray,
  ...values: Array<number | string>
): Assertion<T>
export function assertion<T>(
  e0: string | TemplateStringsArray,
  e1: undefined | number | string | AssertLike<T>,
  ...eRest: Array<number | string>
): Assertion<T> {
  if (isTemplateStringsArray(e0)) {
    return {
      type: "Assertion",
      description: recombine(e0, [...e1 !== undefined ? [e1] : [], ...eRest]),
    }
  }
  return {
    type: "Assertion",
    description: e0,
    f: e1 as never,
  }
}
