import { Path, type PathJunction } from "./Path.ts"
import type { Type } from "./Type.ts"

export class OutputVisitorContext {
  constructor(
    readonly diagnostics: Array<Diagnostic>,
    readonly outputPath: Path = new Path(),
    readonly typePath: Path = new Path(),
  ) {}

  visit: VisitOutput = <X extends Type>(
    { value, type, junctions }: VisitArgs<X>,
  ): X["T"] => {
    if (type.decl.output) {
      const { refinementPredicates, visitor } = type.decl.output((f) => f)
      if (refinementPredicates) {
        for (const [key, is] of Object.entries(refinementPredicates)) {
          if (is) {
            const refinement = type.ctx.refinements[key]
            if (refinement !== undefined) {
              if (!is(value, refinement)) {
                return this.diagnose({
                  name: `${type.decl.name} refinement "${key}" unsatisfied.`,
                  message: type.ctx.refinementMessages()![key]!,
                  type,
                  typePath: this.typePath,
                  value,
                  valuePath: this.outputPath,
                })
              }
            }
          }
        }
      }
      if (!visitor) {
        return value
      }
      try {
        return visitor(
          value,
          new OutputVisitorContext(
            this.diagnostics,
            junctions?.value ? this.outputPath.advance(junctions.value) : this.outputPath,
            junctions?.type ? this.typePath.advance(junctions.type) : this.typePath,
          ),
        )
      } catch (exception: unknown) {
        if (exception instanceof Error) {
          return this.diagnose({
            name: exception.name,
            message: exception.message,
            type,
            typePath: this.typePath,
            value,
            valuePath: this.outputPath,
          })
        }
        throw exception
      }
    }
  }

  diagnose = <X extends Type>(diagnostic: Diagnostic<X>): Stub<X["T"]> => {
    this.diagnostics.push(diagnostic)
    return { [Stub.key]: undefined! as X["T"] }
  }
}

export type Stub<T> = Record<typeof Stub.key, T>
export namespace Stub {
  export const key: unique symbol = Symbol()
}

export type VisitOutput = <X extends Type>(args: VisitArgs<X>) => X["T"]

export interface VisitArgs<X extends Type> {
  value: unknown
  type: X
  junctions?: {
    value?: PathJunction
    type?: PathJunction
  }
}

export type Diagnostic<X extends Type = Type> = {
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
