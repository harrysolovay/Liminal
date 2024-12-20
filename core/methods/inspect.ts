import type { PartialType } from "../Type.ts"

export const inspect = {
  [Symbol.for("Deno.customInspect")](
    this: PartialType,
    _inspect: (value: unknown, opts: unknown) => string,
    _opts: unknown,
  ): string {
    return this.display()
  },
}
