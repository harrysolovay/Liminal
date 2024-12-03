import type { AnyType } from "../mod.ts"

export type Diagnostic = {
  error: Error
  trace: string
  type: AnyType
  typePath: string
  value: unknown
  valuePath: string
  setValue: (value: unknown) => void
}

export namespace Diagnostic {
  export function toString({ error, value, valuePath, typePath }: Diagnostic): string {
    return `${error.name}; ${error.message}
    Invalid value: ${value}
    Value path: ${valuePath}
    Type path: ${typePath}`
  }
}
