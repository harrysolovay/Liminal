import type { AnyType } from "./mod.ts"

export interface Diagnostic {
  exception: unknown
  type: AnyType
  value: unknown
  valuePath: string
  setValue: (parentValue: unknown) => void
}

export namespace Diagnostic {
  export function toString({ exception, valuePath, value }: Diagnostic): string {
    return `${
      exception instanceof Error ? `Error "${exception.name}"` : "Exception"
    } from value \`${JSON.stringify(value)}\` at \`root${valuePath}\`: ${
      exception instanceof Error ? exception.message : JSON.stringify(exception)
    }`
  }
}
