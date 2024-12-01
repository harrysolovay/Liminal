import { Path, type PathJunction } from "./Path.ts"
import { type AnyType, declarationKey } from "./Type.ts"

export class ValueVisitorContext {
  constructor(
    readonly diagnostics: Array<Diagnostic>,
    readonly valuePath: Path = new Path(),
    readonly typePath: Path = new Path(),
  ) {}

  visit: VisitValue = (value: unknown, type: AnyType, valueJunction?: PathJunction) => {
    const valuePath = this.valuePath.step(valueJunction)
    const typePath = this.typePath.step(type.name)
    const declaration = type[declarationKey]
    if (declaration.visitValue) {
      const context = new ValueVisitorContext(this.diagnostics, valuePath, typePath)
      value = declaration.visitValue(value, context.visit)
    }
    if (declaration.transform) {
      value = declaration.transform(value)
    }
    const { assertions } = type[""]
    if (assertions.length) {
      assertions.forEach(async ({ assertion, trace, args }) => {
        try {
          await assertion(value, ...args)
        } catch (e: unknown) {
          if (e instanceof Error) {
            return this.diagnostic({
              error: e,
              trace,
              type,
              typePath,
              value,
              valuePath,
            })
          }
          throw e
        }
      })
    }
    return value as never
  }

  diagnostic = <X extends AnyType>(diagnostic: Diagnostic<X>): Stub<X["T"]> => {
    this.diagnostics.push(diagnostic)
    return { [Stub.key]: undefined! as X["T"] }
  }
}

export type Stub<T> = Record<typeof Stub.key, T>
export namespace Stub {
  export const key: unique symbol = Symbol()
}

export type VisitValue = (
  value: unknown,
  type: AnyType,
  valueJunction?: PathJunction,
) => unknown

export type Diagnostic<X extends AnyType = AnyType> = {
  error: Error
  trace: string
  type: X
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
