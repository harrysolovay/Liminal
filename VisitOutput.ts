import dedent from "dedent"
import type { Type } from "./Type.ts"

export type VisitOutput = <X extends Type>(value: unknown, type: X, path: PathBuilder) => X["T"]

export function VisitOutput<T>(diagnostics: Array<Diagnostic>): VisitOutput {
  return (value, type, path) => {
    if (type.decl.output) {
      const { refinementPredicates, visitor } = type.decl.output((v) => v)
      if (refinementPredicates) {
        for (const [key, is] of Object.entries(refinementPredicates)) {
          if (is) {
            const refinement = type.ctx.refinements[key]
            if (refinement !== undefined) {
              if (!is(value, type.ctx.refinements[key])) {
                diagnostics.push({
                  name: `${type.name} refinement "${key}" unsatisfied.`,
                  message: type.ctx.refinementMessages()![key]!,
                  type,
                  value,
                  path,
                })
              }
            }
          }
        }
      }
      if (visitor) {
        try {
          return visitor(value, VisitOutput(diagnostics), path)
        } catch (exception: unknown) {
          if (exception instanceof Error) {
            diagnostics.push({
              name: exception.name,
              message: exception.message,
              type,
              value,
              path,
            })
          } else {
            throw exception
          }
          return undefined!
        }
      }
      return value
    }
  }
}

export type Diagnostic = {
  name: string
  message: string
  type: Type
  value: unknown
  path: PathBuilder
}

export class PathBuilder {
  static format = (junctions: PathJunctions): string =>
    junctions.reduce<string>((acc, cur) => {
      return `${acc}${typeof cur === "number" ? `[${cur}]` : `.${cur}`}`
    }, "")

  constructor(
    readonly typeJunctions: PathJunctions = [],
    readonly valueJunctions: PathJunctions = [],
  ) {}

  type = (junction: PathJunction) =>
    new PathBuilder([...this.typeJunctions, junction], this.valueJunctions)

  value = (junction: PathJunction) =>
    new PathBuilder(this.typeJunctions, [...this.valueJunctions, junction])
}

export type PathJunction = number | string
export type PathJunctions = Array<PathJunction>

export function serializeDiagnostics(diagnostics: Array<Diagnostic>): string {
  return diagnostics.map(({ name, message, value, path }, i) =>
    dedent`
      ${i}: ${name}; ${message}

      Invalid value: ${value}

      Value path: ${PathBuilder.format(path.typeJunctions)}
       Type path: ${PathBuilder.format(path.typeJunctions)}
    `
  ).join("\n\n")
}
