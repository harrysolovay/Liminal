import type { Type } from "../Type.ts"
import { declare } from "../TypeDeclaration.ts"

export function transform<From extends Type, IntoT>(
  name: string,
  from: From,
  f: (initial: From["T"]) => IntoT,
): Type<IntoT, {}, From["P"]> {
  return declare({
    name: "transform",
    source: {
      factory: transform,
      args: { name, from, f },
    },
    subschema: (visit) => visit(from),
    output: (_) =>
      _<From["T"]>({
        visitor: (value, visit, path) => f(visit(value, from, path)),
      }),
  })
}
