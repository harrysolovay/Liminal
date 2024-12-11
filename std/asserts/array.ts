import { assert } from "../../liminal/asserts/assert.ts"

export function minLength<T>(value: Array<T>, minLength: number) {
  assert(
    value.length >= minLength,
    `Length must be gte ${minLength} elements; received array of length ${value.length}.`,
  )
}

export function maxLength<T>(value: Array<T>, maxLength: number) {
  assert(
    value.length <= maxLength,
    `Length must be lte ${maxLength} elements; received array of length ${value.length}.`,
  )
}
