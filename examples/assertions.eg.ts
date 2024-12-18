import { assert } from "@std/assert"
import { L } from "liminal"

export namespace number {
  export const min = L.Assertion(minDescription, assertMin)
  export const max = L.Assertion(maxDescription, assertMax)

  function minDescription(min: number): string {
    return `Must be gte ${min}.`
  }
  function assertMin(value: number, min: number): void {
    assert(value >= min, minDescription(min))
  }
  function maxDescription(max: number): string {
    return `Must be lte ${max}.`
  }
  function assertMax(value: number, max: number): void {
    assert(value <= max, maxDescription(max))
  }
}

export namespace array {
  export const minLength = L.Assertion(minLengthDescription, assertMinLength)
  export const maxLength = L.Assertion(maxLengthDescription, assertMaxLength)

  function minLengthDescription(minLength: number) {
    return `Length must be gte ${minLength} elements.`
  }
  function assertMinLength<T>(value: Array<T>, minLength: number) {
    assert(value.length >= minLength, minLengthDescription(minLength))
  }
  function maxLengthDescription(maxLength: number) {
    return `Length must be lte ${maxLength} elements.`
  }
  function assertMaxLength<T>(value: Array<T>, maxLength: number) {
    assert(value.length <= maxLength, maxLengthDescription(maxLength))
  }
}
