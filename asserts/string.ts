import { assert } from "../util/mod.ts"

export function minLength(value: string, minLength: number) {
  assert(value.length >= minLength, `Length must be gte ${minLength} chars.`)
}

export function maxLength(value: string, maxLength: number) {
  assert(value.length <= maxLength, `Length must be lte ${maxLength} chars.`)
}
