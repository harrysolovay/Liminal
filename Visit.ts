import type { Type } from "./Type.ts"

export type ProcessValue<T> = (value: T, type: Type<T>, junction: Junction) => T

export function ProcessValue<T>(
  diagnostics: Array<Diagnostic>,
  junctions: Array<number | string> = [],
): ProcessValue<T> {
  return (value, type, junction) => {
    const { assertRefinements } = type.declaration
    if (assertRefinements) {
      for (const [refinementKey, assertRefinement] of Object.entries(assertRefinements)) {
        if (assertRefinement) {
          const refinement = type.ctx.refinements[refinementKey]
          if (refinement !== undefined) {
            fallible(() => assertRefinement(value, type.ctx.refinements[refinementKey]))
          }
        }
      }
    }
    return fallible(() =>
      type.declaration.process
        ? type.declaration.process.call(
          type,
          value,
          ProcessValue(diagnostics, [...junctions, junction]),
        )
        : value
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
