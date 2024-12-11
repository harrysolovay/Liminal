import type { AnyType } from "../mod.ts"

export interface Diagnostic {
  error: Error
  trace: string
  type: AnyType
  value: unknown
  valuePath: string
  setValue: (parentValue: unknown) => void
}

export namespace Diagnostic {
  export function toString({ error, valuePath, value }: Diagnostic): string {
    return `Error "${error.name}" with value \`${
      JSON.stringify(value)
    }\` at \`root${valuePath}\`: ${error.message}`
  }
}
