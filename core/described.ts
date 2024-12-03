import { Context } from "./Context.ts"
import { Type, typeKey } from "./Type.ts"

export function described<T, P extends keyof any>(
  type: Type<T, P>,
  description: string,
): Type<T, P> {
  const { declaration, ctx } = type[typeKey]
  return Type(declaration, new Context([description, ...ctx.parts], ctx.assertions, ctx.metadata))
}
