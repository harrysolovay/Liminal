import type { Refinements, Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"

export function transform<T, R extends Refinements, P extends keyof any, O>(
  from: Type<T, R, P>,
  f: (from: T) => O,
): Type<O, {}, P> {
  return declare({
    name: "transform",
    source: {
      factory: transform,
      args: { from },
    },
    subschema: (ref) => ref(from),
    assert: from.declaration.assert,
    transform: f,
    assertRefinementsValid: () => {},
    assertRefinements: {},
  })
}
