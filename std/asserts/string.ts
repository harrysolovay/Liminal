import { assert } from "../../util/assert.ts"

export function minLength(value: string, minLength: number) {
  assert(
    value.length >= minLength,
    `Length must be gte ${minLength} chars; received string of length ${value.length}.`,
  )
}

export function maxLength(value: string, maxLength: number) {
  assert(
    value.length <= maxLength,
    `Length must be lte ${maxLength} chars; received string of length ${value.length}.`,
  )
}
