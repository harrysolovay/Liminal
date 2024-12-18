import { Param } from "./Param.ts"

export const DescriptionParamKey: unique symbol = Symbol()

export interface DescriptionArg {
  [DescriptionParamKey]: string
}

export function DescriptionParam<K extends symbol, A = string>(
  key: K,
  serialize?: (value: A) => string,
): Param<K, A, DescriptionArg> {
  return Param(key, (value) => ({
    [DescriptionParamKey]: (serialize?.(value) ?? value) as string,
  }))
}
