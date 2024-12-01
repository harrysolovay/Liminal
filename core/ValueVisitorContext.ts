import { Path, type PathJunction } from "./Path.ts"
import type { AnyType } from "./Type.ts"

export class ValueVisitorContext {
  constructor(
    readonly diagnostics: Array<Diagnostic>,
    readonly valuePath: Path = new Path(),
    readonly typePath: Path = new Path(),
  ) {}

  visit: VisitOutput = <X extends AnyType>(value: X["T"], type: X, paths?: ValueVisitPaths) => {
    const valuePath = paths?.value ? this.valuePath.step(paths.value) : this.valuePath
    const typePath = paths?.type ? this.typePath.step(paths.type) : this.typePath

    // if (type.decl.output) {
    //   const { refinementPredicates, visitor } = type.decl.output((f) => f)
    //   if (refinementPredicates) {
    //     for (const [key, is] of Object.entries(refinementPredicates)) {
    //       if (is) {
    //         const refinement = type.ctx.refinements[key]
    //         if (refinement !== undefined) {
    //           if (!is(value, refinement)) {
    //             return this.diagnose({
    //               name: `${type.decl.name} refinement "${key}" unsatisfied.`,
    //               message: type.ctx.refinementMessages()![key]!,
    //               type,
    //               typePath,
    //               value,
    //               valuePath,
    //             })
    //           }
    //         }
    //       }
    //     }
    //   }
    //   if (!visitor) {
    //     return value
    //   }
    //   try {
    //     return visitor(value, new ValueVisitorContext(this.diagnostics, valuePath, typePath))
    //   } catch (e: unknown) {
    //     if (e instanceof Error) {
    //       return this.diagnose({
    //         name: e.name,
    //         message: e.message,
    //         type,
    //         typePath: this.typePath,
    //         value,
    //         valuePath: this.valuePath,
    //       })
    //     }
    //     throw e
    //   }
    // }
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

export type VisitOutput = <X extends AnyType>(
  value: X["T"],
  type: X,
  paths: ValueVisitPaths,
) => void

export type ValueVisitPaths = {
  type?: PathJunction
  value?: PathJunction
}

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
