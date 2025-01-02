import { L } from "liminal"

export function min(min: number): L.Assertion<number> {
  return L.assert(`Must be gte ${min}.`, (value) => value >= min)
}

export function max(max: number): L.Assertion<number> {
  return L.assert(`Must be lte ${max}.`, (value) => value <= max)
}

export function minLength(minLength: number): L.Assertion<string | Array<unknown>> {
  return L.assert(`Length must be gte ${minLength} elements.`, (value) => value.length >= minLength)
}

export function maxLength(maxLength: number): L.Assertion<string | Array<unknown>> {
  return L.assert(`Length must be lte ${maxLength} elements.`, (value) => value.length <= maxLength)
}
