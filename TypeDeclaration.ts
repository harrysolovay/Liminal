import { RefSchema, type Schema } from "./Schema.ts"
import { type Args, type ExcludeArgs, type Params, SemanticContext } from "./SemanticContext.ts"
import type { Refinements, Type, UnappliedRefiners } from "./Type.ts"
import type { Visit } from "./Visit.ts"

export type TypeDeclaration<T, R extends Refinements, O> = {
  /** The name of the type. */
  name: string
  /** The origin of the type (a `declare`d type or `declare`d-type-returning function). */
  source: TypeSource
  /** How to create the JSON schema for the current type. */
  subschema: (ref: (type: Type) => Schema) => Schema
  /** Transform the structured output into the target `T` value. */
  visitor: (value: O, visit: Visit<T>) => T
  /** Validate the set of specified refinements. */
  assertRefinementsValid: (refinements: R) => void
  /** Validations corresponding to available refinements. */
  assertRefinements: {
    [K in keyof R]: (value: O, constraint: Exclude<R[K], undefined>) => void
  }
}

export type TypeSource = {
  getType: () => Type
  factory?: never
  args?: never
} | {
  getType?: never
  factory: (...args: any) => Type
  args: Record<string, unknown>
}

export function declare<O>() {
  return <T, R extends Refinements, P extends keyof any>(
    declaration: TypeDeclaration<T, R, O>,
  ): Type<T, R, P> => declare_<T, R, P, O>(declaration, new SemanticContext([], {} as R))
}

function declare_<T, R extends Refinements, P extends keyof any, O>(
  declaration: TypeDeclaration<T, R, O>,
  ctx: SemanticContext<T, R, P>,
): Type<T, R, P> {
  const type = Object.assign(
    <P2 extends Params>(template: TemplateStringsArray, ...params: P2) =>
      declare_<T, R, P | P2[number], O>(declaration, ctx.add(template, params)),
    {
      ...{} as { T: T; P: P },
      declaration,
      ctx,
      refine: <const V extends UnappliedRefiners<R>>(refinements: V) => {
        const nextCtx = ctx.refine(refinements)
        if (declaration) {
          declaration.assertRefinementsValid(nextCtx.refinements as never)
        }
        return declare_(declaration, nextCtx as never) as never
      },
      schema: () => RefSchema()(type),
      fill: <A extends Partial<Args<P>>>(args: A) =>
        declare_<T, R, ExcludeArgs<P, A>, O>(declaration as never, ctx.apply(args)) as never,
    },
  )
  return type
}
