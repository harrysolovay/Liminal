import type { Type } from "./Type.ts"

export type Visit<T> = (value: T, type: Type<T>, junction: Junction) => T

export function Visit<T>(
  diagnostics: Array<Diagnostic>,
  junctions: Array<number | string> = [],
): Visit<T> {
  return (value, type, junction) => {
    const { assertRefinements } = type.declaration
    for (const [refinementKey, assertRefinement] of Object.entries(assertRefinements)) {
      const refinement = type.ctx.refinements[refinementKey]
      if (refinement !== undefined) {
        fallible(() => assertRefinement(value, type.ctx.refinements[refinementKey]))
      }
    }
    return fallible(() =>
      type.declaration.visitor(value, Visit(diagnostics, [...junctions, junction]))
    )

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
