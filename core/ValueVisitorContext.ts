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
    return value as never
  }

  diagnose = <X extends AnyType>(diagnostic: Diagnostic<X>): Stub<X["T"]> => {
    this.diagnostics.push(diagnostic)
    return { [Stub.key]: undefined! as X["T"] }
  }
}

export type Stub<T> = Record<typeof Stub.key, T>
export namespace Stub {
  export const key: unique symbol = Symbol()
}

export type VisitValue = <T>(
  value: unknown,
  type: AnyType,
  valueJunction?: PathJunction,
) => T

export type Diagnostic<X extends AnyType = AnyType> = {
  name: string
  message: string
  type: X
  typePath: Path
  value: unknown
  valuePath: Path
}

export function serializeDiagnostics(diagnostics: Array<Diagnostic>): string {
  return diagnostics.map(({ name, message, value, valuePath, typePath }, i) => {
    return `Diagnostic ${i}: ${name}; ${message}
  Invalid value: ${value}
  Value path: ${typePath.format()}
  Type path: ${valuePath.format()}`
  }).join("\n\n")
}
