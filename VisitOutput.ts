import dedent from "dedent"
import { Path, type PathJunction } from "./Path.ts"
import type { Type } from "./Type.ts"

export class OutputVisitorContext {
  constructor(readonly valuePath = new Path(), readonly typePath = new Path()) {}

  descend = (valueJunction?: PathJunction, typeJunction?: PathJunction): OutputVisitorContext =>
    new OutputVisitorContext(this.valuePath.add(valueJunction), this.typePath.add(typeJunction))
}

export type VisitOutput = <X extends Type>(
  value: unknown,
  type: X,
  ctx: OutputVisitorContext,
) => X["T"]

export function VisitOutput<T>(diagnostics: Array<Diagnostic>): VisitOutput {
  return (value, type, visitorCtx) => {
    if (type.decl.output) {
      const { refinementPredicates, visitor } = type.decl.output((f) => f)
      if (refinementPredicates) {
        for (const [key, is] of Object.entries(refinementPredicates)) {
          if (is) {
            const refinement = type.ctx.refinements[key]
            if (refinement !== undefined) {
              if (!is(value, type.ctx.refinements[key])) {
                const setValue = Stubbed<T>()
                diagnostics.push({
                  name: `${type.name} refinement "${key}" unsatisfied.`,
                  message: type.ctx.refinementMessages()![key]!,
                  type,
                  typePath: visitorCtx.typePath,
                  value,
                  valuePath: visitorCtx.valuePath,
                  setValue,
                })
                return setValue
              }
            }
          }
        }
      }
      if (!visitor) {
        return value
      }
      try {
        return visitor(value, VisitOutput(diagnostics), visitorCtx)
      } catch (exception: unknown) {
        if (exception instanceof Error) {
          const setValue = Stubbed<T>()
          diagnostics.push({
            name: exception.name,
            message: exception.message,
            type,
            typePath: visitorCtx.typePath,
            value,
            valuePath: visitorCtx.valuePath,
            setValue,
          })
          return setValue
        }
        throw exception
      }
    }
  }
}

export type Diagnostic = {
  name: string
  message: string
  type: Type
  typePath: Path
  value: unknown
  valuePath: Path
  setValue: (value: any) => void
}

const stub_ = Symbol()
type Stubbed<T> = Record<typeof stub_, T> & ((value: T) => void)
function Stubbed<T>(): Stubbed<T> {
  const stub = { [stub_]: undefined! as T }
  return Object.assign((value: T) => {
    stub[stub_] = value
  }, stub)
}

export function serializeDiagnostics(diagnostics: Array<Diagnostic>): string {
  return diagnostics.map(({ name, message, value, valuePath, typePath }, i) =>
    dedent`
      ${i}: ${name}; ${message}

      Invalid value: ${value}

      Value path: ${typePath.format()}
       Type path: ${valuePath.format()}
    `
  ).join("\n\n")
}
