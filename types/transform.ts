import { declare, type Type } from "../core/mod.ts"

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
        visitor: (value, ctx) => f(ctx.visit({ value, type: from })),
      }),
  })
}
