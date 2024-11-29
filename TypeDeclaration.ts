import { type Args, Context, type ExcludeArgs, type Params } from "./Context.ts"
import { RefSchema, type Schema } from "./Schema.ts"
import type { ExcludeRefiners, Refinements, Type, Unapplied, UnappliedRefiners } from "./Type.ts"
import { Inspectable } from "./util/Inspectable.ts"
import type { ProcessValue } from "./Visit.ts"

// TODO: get rid of `O`
export type TypeDeclaration<T, R extends Refinements, P extends keyof any, O> = {
  /** The name of the type. */
  name: string
  /** The origin of the type (a `declare`d type or `declare`d-type-returning function). */
  source: TypeSource
  /** How to create the JSON schema for the current type. */
  subschema: (visit: (type: Type) => Schema, ctx: Context<T, R, P>) => Schema
  /** Transform the structured output `O` into the target `T` value. */
  process?: (value: O, processValue: ProcessValue<T>) => T
  /** Validate the set of specified refinements. */
  assertRefinementsValid?: (refinements: R) => void
  /** Validations corresponding to available refinements. */
  assertRefinements?: {
    [K in keyof R]+?: (value: O, constraint: R[K] extends Unapplied<infer U> ? U : never) => void
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
    declaration: TypeDeclaration<T, R, P, O>,
  ): Type<T, R, P> => declare_<T, R, P, O>(declaration, new Context([], {}))
}

function declare_<T, R extends Refinements, P extends keyof any, O>(
  declaration: TypeDeclaration<T, R, P, O>,
  ctx: Context<T, R, P>,
): Type<T, R, P> {
  return Object.assign(
    <P2 extends Params>(
      template: TemplateStringsArray,
      ...params: P2
    ) =>
      declare_<T, R, P | P2[number], O>(declaration as never, ctx.add(template, params) as never),
    {
      ...Inspectable((inspect) => {
        const { source } = declaration
        if (source.getType) {
          return declaration.name
        }
        return `${declaration.name}(${inspect(source.args)})`
      }) as Inspectable & { T: T; P: P },
      declaration,
      ctx,
      refine: <const V extends UnappliedRefiners<R>>(refinements: V) => {
        const nextCtx = ctx.refine(refinements)
        if (declaration?.assertRefinementsValid) {
          declaration.assertRefinementsValid(nextCtx.refinements as never)
        }
        return declare_<T, ExcludeRefiners<R, V>, P, O>(declaration as never, nextCtx)
      },
      schema(this: Type<T, R, never>): Schema {
        return RefSchema()(this)
      },
      fill<A extends Partial<Args<P>>>(args: A) {
        return declare_<T, R, ExcludeArgs<P, A>, O>(declaration, ctx.apply(args))
      },
    },
  )
}
