import type { Type } from "./Type.ts"

export type VisitOutput = <X extends Type>(value: unknown, type: X, junction: Junction) => X["T"]

export function VisitOutput<T>(
  diagnostics: Array<Diagnostic>,
  junctions: Array<number | string> = [],
): VisitOutput {
  return (value, type, junction) => {
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
        return fallible(() => visitor(value, VisitOutput(diagnostics, [...junctions, junction])))
      }
      return value
    }

    function fallible<T>(f: () => T) {
      try {
        return f()
      } catch (error: unknown) {
        if (error instanceof Error) {
          diagnostics.push({ error, type, junctions: [...junctions, junction] })
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
  junctions: Array<Junction>
}

export type Junction = number | string
