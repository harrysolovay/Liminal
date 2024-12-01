import { assert } from "../util/mod.ts"

export function minLength<T>(minLength: number, value: Array<T>) {
  assert(value.length >= minLength, `Length must be gte ${minLength} elements.`)
}

export function maxLength<T>(maxLength: number, value: Array<T>) {
  assert(value.length <= maxLength, `Length must be lte ${maxLength} elements.`)
}
