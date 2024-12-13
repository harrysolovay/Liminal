import { assert } from "@std/assert"
import { L } from "../mod.ts"

export const min = L.assert((min) => `Must be gte ${min}.`, assertMin)
export const max = L.assert((max) => `Must be lte ${max}.`, assertMax)

function assertMin(value: number, min: number) {
  assert(value >= min, `Must be gte ${min}; received ${value}.`)
}

function assertMax(value: number, max: number) {
  assert(value <= max, `Must be lte ${max}; received ${value}.`)
}
