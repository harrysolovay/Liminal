import { type AnyType, typeKey } from "./Type.ts"

export type PathJunction = number | string

export type VisitValue = (
  value: unknown,
  type: AnyType,
  formatValuePath?: FormatPath,
  formatTypePath?: FormatPath,
) => unknown

export type FormatPath = (leading: PathJunction) => undefined | PathJunction

export function VisitValue(
  diagnostics: Array<Diagnostic>,
  parentValuePath: PathJunction = "root",
  parentTypePath: PathJunction = "root",
): VisitValue {
  return (value, type, formatValuePath, formatTypePath) => {
    const valuePath = formatValuePath?.(parentValuePath) ?? parentValuePath
    const typePath = formatTypePath?.(parentTypePath) ?? parentTypePath
    const { declaration, context } = type[typeKey]
    if (declaration.visitValue) {
      value = declaration.visitValue(value, VisitValue(diagnostics, valuePath, typePath))
    }
    if (declaration.transform) {
      value = declaration.transform(value)
    }
    const { assertions } = context
    if (assertions.length) {
      assertions.forEach(({ assertion, trace, args }) => {
        try {
          assertion(value, ...args)
        } catch (e: unknown) {
          if (e instanceof Error) {
            diagnostics.push({
              error: e,
              trace,
              type,
              typePath,
              value,
              valuePath,
              setValue: () => {}, // TODO
            })
            return { [stubKey]: undefined }
          }
          throw e
        }
      })
    }
    return value
  }
}

export function isStub(value: unknown) {
  return typeof value === "object" && value !== null && stubKey in value
}
const stubKey: unique symbol = Symbol()

export type Diagnostic = {
  error: Error
  trace: string
  type: AnyType
  typePath: PathJunction
  value: unknown
  valuePath: PathJunction
  setValue: (value: unknown) => void
}

export function serializeDiagnostics(diagnostics: Array<Diagnostic>): string {
  return diagnostics.map(({ error, value, valuePath, typePath }) =>
    `${error.name}; ${error.message}
  Invalid value: ${value}
  Value path: ${valuePath}
  Type path: ${typePath}`
  ).join("\n\n")
}
