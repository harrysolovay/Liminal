import { type Args, type Assertion, Context, type Params } from "./Context.ts"
import { inspectBearer } from "./inspectBearer.ts"
import { type Type, type TypeDeclaration, typeKey } from "./Type.ts"

export function declareType<T, P extends keyof any = never>(
  declaration: TypeDeclaration,
  context: Context = new Context([], [], {}),
): Type<T, P> {
  const self = Object.assign(
    (template: TemplateStringsArray, ...params: Params) =>
      declareType(
        declaration,
        new Context(
          [{ template, params }, ...context.parts],
          context.assertions,
          context.metadata,
        ),
      ),
    {
      [typeKey]: { declaration, context },
      fill: (args: Args) =>
        declareType(
          declaration,
          new Context(
            [{ args }, ...context.parts],
            context.assertions,
            context.metadata,
          ),
        ),
      assert: (assertion: Assertion, ...args: unknown[]) => {
        const trace = new Error().stack ?? ""
        return declareType(
          declaration,
          new Context(
            context.parts,
            [...context.assertions, { assertion, args, trace }],
            context.metadata,
          ),
        )
      },
      annotate: (key: symbol, value: unknown) =>
        declareType(
          declaration,
          new Context(context.parts, context.assertions, {
            ...context.metadata,
            [key]: value,
          }),
        ),
      unchecked: () => self,
      ...inspectBearer,
    },
  )
  return self as never
}
