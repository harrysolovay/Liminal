import { type AnyType, typeKey } from "./Type.ts"

export type PathJunction = number | string

export type VisitValue = (
  value: unknown,
  type: AnyType,
  setter: (setParentValue: SetValue) => SetValue,
  options?: VisitValueOptions,
) => unknown

export type VisitValueOptions = {
  formatValuePath?: FormatPath
  formatTypePath?: FormatPath
}

export type SetValue = (value: unknown) => unknown

export type FormatPath = (leading: PathJunction) => undefined | PathJunction

export function VisitValue(
  diagnostics: Array<Diagnostic>,
  parentSetValue?: SetValue,
  parentValuePath: PathJunction = "root",
  parentTypePath: PathJunction = "root",
): VisitValue {
  return (value, type, setter, { formatValuePath, formatTypePath } = {}) => {
    const setValue = setter(parentSetValue ?? (() => {}))
    const valuePath = formatValuePath?.(parentValuePath) ?? parentValuePath
    const typePath = formatTypePath?.(parentTypePath) ?? parentTypePath
    const { declaration } = type[typeKey]
    if (declaration.visitValue) {
      value = declaration.visitValue(value, VisitValue(diagnostics, setValue, typePath))
    }
    if (declaration.transform) {
      value = declaration.transform(value)
    }
    return valueOrStub({ diagnostics, value, type, valuePath, typePath, setValue })
  }
}

export function valueOrStub({ diagnostics, value, type, valuePath, typePath, setValue }: {
  diagnostics: Array<Diagnostic>
  value: unknown
  type: AnyType
  valuePath: PathJunction
  typePath: PathJunction
  setValue: SetValue
}): unknown {
  const { assertions } = type[typeKey].context
  let stub = false
  if (assertions.length) {
    assertions.forEach(({ assertion, trace, args }) => {
      try {
        assertion(value, ...args)
      } catch (e: unknown) {
        if (e instanceof Error) {
          stub = true
          diagnostics.push({
            error: e,
            trace,
            type,
            typePath,
            value,
            valuePath,
            setValue,
          })
        }
        throw e
      }
    })
  }
  if (stub) {
    return { [stubKey]: undefined }
  }
  return value
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
