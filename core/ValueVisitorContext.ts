import { Path, type PathJunction } from "./Path.ts"
import { type AnyType, declarationKey } from "./Type.ts"

export type VisitValue = (
  value: unknown,
  type: AnyType,
  valueJunction?: PathJunction,
) => unknown

export function VisitValue(
  diagnostics: Array<Diagnostic>,
  parentValuePath: Path = new Path(),
  parentTypePath: Path = new Path(),
): VisitValue {
  return (value: unknown, type: AnyType, valueJunction?: PathJunction) => {
    const valuePath = parentValuePath.step(valueJunction)
    const typePath = parentTypePath.step(type.name)
    const declaration = type[declarationKey]
    if (declaration.visitValue) {
      value = declaration.visitValue(value, VisitValue(diagnostics, valuePath, typePath))
    }
    if (declaration.transform) {
      value = declaration.transform(value)
    }
    const { assertions } = type[""]
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
            })
            return { [stubKey]: undefined }
          }
          throw e
        }
      })
    }
    return value as never
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
  typePath: Path
  value: unknown
  valuePath: Path
}

export function serializeDiagnostics(diagnostics: Array<Diagnostic>): string {
  return diagnostics.map(({ error, value, valuePath, typePath }, i) => {
    return `Diagnostic ${i}: ${error.name}; ${error.message}
  Invalid value: ${value}
  Value path: ${typePath.format()}
  Type path: ${valuePath.format()}`
  }).join("\n\n")
}
