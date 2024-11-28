import type { Type } from "./Type.ts"

export type Visit<T> = (value: T, type: Type<T>, junction: Junction) => T

export function Visit<T>(
  diagnostics: Array<Diagnostic> = [],
  junctions: Array<number | string> = [],
): Visit<T> {
  return (value, type, junction) => {
    try {
      return type.declaration.transform(value, Visit(diagnostics, [...junctions, junction]))
    } catch (error: unknown) {
      if (error instanceof Error) {
        diagnostics.push({ error, type, junctions })
      } else {
        throw error
      }
      return undefined!
    }
  }
}

export type Diagnostic = {
  error: Error
  type: Type
  junctions: Array<Junction>
}

export type Junction = number | string
