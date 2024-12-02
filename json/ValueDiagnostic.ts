import type { AnyType } from "../mod.ts"

export type ValueDiagnostic = {
  error: Error
  trace: string
  type: AnyType
  typePath: string
  value: unknown
  valuePath: string
  setValue: (value: unknown) => void
}

export function serializeValueDiagnostics(diagnostics: Array<ValueDiagnostic>): string {
  return diagnostics.map(({ error, value, valuePath, typePath }) =>
    `${error.name}; ${error.message}
  Invalid value: ${value}
  Value path: ${valuePath}
  Type path: ${typePath}`
  ).join("\n\n")
}
