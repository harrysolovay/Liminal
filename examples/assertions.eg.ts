import { assert } from "@std/assert"
import { L } from "liminal"

export namespace number {
  export function min(min: number) {
    const description = `Must be gte ${min}.`
    return L.Assertion(description, (value: number) => {
      assert(value >= min, description)
    })
  }

  export function max(max: number) {
    const description = `Must be lte ${max}.`
    return L.Assertion(description, (value: number) => {
      assert(value <= max, description)
    })
  }
}

export namespace array {
  export function minLength<T>(minLength: number) {
    const description = `Length must be gte ${minLength} elements.`
    return L.Assertion(description, (value: Array<T>) => {
      assert(value.length >= minLength, description)
    })
  }

  export function maxLength<T>(maxLength: number) {
    const description = `Length must be lte ${maxLength} elements.`
    return L.Assertion(description, (value: Array<T>) => {
      assert(value.length <= maxLength, description)
    })
  }
}
