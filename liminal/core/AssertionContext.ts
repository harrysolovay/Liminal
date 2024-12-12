import type { JSONTypeKind } from "./JSONSchema.ts"
import type { Type } from "./Type.ts"

export class AssertionContext {
  constructor(
    readonly exceptions: Array<unknown>,
    readonly path: string,
  ) {}

  visit = <T>(
    type: Type<JSONTypeKind, T, symbol>,
    value: unknown,
    junction?: number | string,
  ) => {
    try {
      type.declaration.assert(
        value,
        new AssertionContext(
          this.exceptions,
          junction === undefined ? this.path : `${this.path}["${junction}"]`,
        ),
      )
    } catch (e: unknown) {
      this.exceptions.push(e)
    }
  }
}
