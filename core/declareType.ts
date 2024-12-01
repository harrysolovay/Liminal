import { Inspectable } from "../util/mod.ts"
import { type Args, type Assertion, Context, type Params } from "./Context.ts"
import { transform } from "./transform.ts"
import { type AnyType, declarationKey, type Type, type TypeDeclaration } from "./Type.ts"

export function declareType<T>(declaration: TypeDeclaration<T>): Type<T, never> {
  return declare_<T, never>(declaration, new Context([], []))
}

function declare_<T, P extends keyof any>(
  declaration: TypeDeclaration<T>,
  context: Context,
): Type<T, P> {
  const type = Object.assign(
    (template: TemplateStringsArray, ...params: Params) =>
      declare_(
        declaration,
        new Context([{ template, params }, ...context.parts], context.assertions),
      ),
    {
      [declarationKey]: declaration,
      "": context,
      fill: (args: Args) =>
        declare_(
          declaration,
          new Context([{ args }, ...context.parts], context.assertions),
        ),
      assert: (assertion: Assertion, ...args: unknown[]) =>
        declare_(
          declaration,
          new Context(context.parts, [...context.assertions, [assertion, args]]),
        ),
      transform: <O>(name: string, f: (from: T) => O) =>
        transform(name, type as never as AnyType, f),
      ...Inspectable((inspect) => {
        const { source } = declaration
        if (source.getType) {
          return declaration.name
        }
        return `${declaration.name}(${inspect(source.args)})`
      }),
    },
  )
  return type as never
}
