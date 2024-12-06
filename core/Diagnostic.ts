import type { AnyType } from "../mod.ts"

export type Diagnostic = {
  error: Error
  trace: string
  type: AnyType
  value: unknown
  valuePath: string
  setValue: (parentValue: unknown) => void
}

export namespace Diagnostic {
  // TODO: should this implicitly include `value`, even though it's likely present in the assertion.
  export function toString({ error, valuePath }: Diagnostic): string {
    return `Encountered ${error.name} at value path ${valuePath}: ${error.message}`
  }
}
