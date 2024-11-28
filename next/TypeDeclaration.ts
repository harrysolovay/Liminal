import type { AssertionContext } from "./AssertionContext.ts"
import { Ref, type Schema } from "./Schema.ts"
import { type Args, type ExcludeArgs, type Params, SemanticContext } from "./SemanticContext.ts"
import type { Refinements, Type, UnappliedRefiners } from "./Type.ts"

export type TypeDeclaration<T, R extends Refinements, O> = {
  /** The name of the type. */
  name: string
  /** The origin of the type (a `declare`d type or `declare`d-type-returning function). */
  source: TypeSource
  /** How to create the JSON schema for the current type. */
  subschema: (ref: (type: Type) => Schema) => Schema
  /** Validate the raw structured output is of the expected type. */
  assert: (value: unknown, assertionCtx: AssertionContext) => asserts value is O
  /** Transform the structured output into the target `T` value. */
  transform: (value: O) => T
  /** Validate the set of specified refinements. */
  assertRefinementsValid?: (refinements: R, assertionCtx: AssertionContext) => void
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

export function declare<
  T,
  R extends Refinements,
  P extends keyof any,
  O = T,
>(
  declaration: TypeDeclaration<T, R, O>,
): Type<T, R, P> {
  return declare_<T, R, P, O>(declaration, new SemanticContext([], {} as R))
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
        // TODO: clean up typing.
        return declare_(declaration, ctx.refine(refinements) as never) as never
      },
      schema: () => Ref()(type),
      fill: <A extends Partial<Args<P>>>(args: A) =>
        declare_<T, R, ExcludeArgs<P, A>, O>(declaration, ctx.apply(args)) as any,
    },
  )
  return type
}
