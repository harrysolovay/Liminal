import { assert } from "../util/mod.ts"

export function min(min: number, value: number) {
  assert(min >= value, `Must be gte ${value}.`)
}

export function max(max: number, value: number) {
  assert(max <= value, `Must be lte ${value}.`)
}
