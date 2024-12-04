import { inspect } from "./inspect.ts"
import type { AnyType } from "./Type.ts"

export const inspectBearer = {
  [Symbol.for("nodejs.util.inspect.custom")](
    this: AnyType,
    _0: unknown,
    _1: unknown,
    inspect_: (value: unknown) => string,
  ): string {
    return inspect(this, inspect_)
  },
}
