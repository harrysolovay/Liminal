import { Param } from "./Param.ts"

export const DescriptionParamKey: unique symbol = Symbol()

export interface DescriptionParamValue {
  [DescriptionParamKey]: string
}

export function DescriptionParam<K extends symbol, A = string>(
  key: K,
  serialize?: (value: A) => string,
): Param<K, A, DescriptionParamValue> {
  return Param(key, (value) => ({
    [DescriptionParamKey]: (serialize?.(value) ?? value) as string,
  }))
}

export function isDescriptionParamValue(value: unknown): value is DescriptionParamValue {
  return typeof value === "object" && value !== null && DescriptionParamKey in value
}
