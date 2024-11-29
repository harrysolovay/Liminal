import dedent from "dedent"
import type { Type } from "./Type.ts"

export type VisitOutput = <X extends Type>(value: unknown, type: X, path: PathBuilder) => X["T"]

export function VisitOutput<T>(diagnostics: Array<Diagnostic>): VisitOutput {
  return (value, type, path) => {
    const { output } = type.declaration
    if (output) {
      const { asserts, visitor } = output((v) => v)
      if (asserts) {
        for (const [key, assert] of Object.entries(asserts)) {
          if (assert) {
            const refinement = type.ctx.refinements[key]
            if (refinement !== undefined) {
              fallible(() => assert(value, type.ctx.refinements[key]))
            }
          }
        }
      }
      if (visitor) {
        return fallible(() => visitor(value, VisitOutput(diagnostics), path))
      }
      return value
    }

    function fallible<T>(f: () => T) {
      try {
        return f()
      } catch (error: unknown) {
        if (error instanceof Error) {
          diagnostics.push({ error, type, path })
        } else {
          throw error
        }
        return undefined!
      }
    }
  }
}

export type Diagnostic = {
  error: Error
  type: Type
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
  return diagnostics.map(({ path, error }, i) =>
    dedent`
      ${i}: ${error.name}
        - Origin:
          - Type Path: \`${PathBuilder.format(path.valueJunctions)}\`
          - Value Path: \`${PathBuilder.format(path.typeJunctions)}\`
        - Message: ${error.message}
    `
  ).join("\n\n")
}
