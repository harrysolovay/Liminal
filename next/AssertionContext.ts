import type { Type } from "./Type.ts"

export class AssertionContext {
  constructor(
    readonly errors: Map<Type, Array<ErrorData>>,
    readonly currentPath: Array<Junction>,
  ) {}

  subassert(type: Type, value: unknown, junction: Junction) {
    try {
      type.declaration.assert(
        value,
        new AssertionContext(this.errors, [...this.currentPath, junction]),
      )
    } catch (e: unknown) {
      if (e instanceof Error) {
        const errors = this.errors.get(type)
        const value: ErrorData = {
          path: this.currentPath,
          error: e,
        }
        if (errors) {
          errors.push(value)
        } else {
          this.errors.set(type, [value])
        }
      }
      throw e
    }
  }
}

type Junction = number | string
type ErrorData = { path: Array<Junction>; error: Error }
