import type { PartialType } from "../Type.ts"

export const inspect = {
  [Symbol.for("nodejs.util.inspect.custom")](
    this: PartialType,
    _0: unknown,
    _1: unknown,
    _inspect_: (value: unknown) => string,
  ): string {
    return this.display()
  },
}
