import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"

export function transform<From extends Type, IntoT>(
  name: string,
  from: From,
  f: (initial: From["T"]) => IntoT,
): Type<IntoT, {}, From["P"]> {
  return declare<From["T"]>()({
    name: "transform",
    source: {
      factory: transform,
      args: { name, from, f },
    },
    subschema: (ref) => ref(from),
    transform: (value, visit) => f(visit(value, from, name)),
    assertRefinementsValid: () => {},
    assertRefinements: {},
  })
}
