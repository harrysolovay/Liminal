import type { AnyType } from "../Type.ts"
import { inspect } from "./inspect.ts"

export const inspectBearer = {
  [Symbol.for("Deno.customInspect")](
    this: AnyType,
    inspect_: (value: unknown, opts: unknown) => string,
    opts: Deno.InspectOptions,
  ): string {
    return inspect(this, (x) => inspect_(x, opts))
  },
}
