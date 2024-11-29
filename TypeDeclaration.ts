import { type Args, Context, type ExcludeArgs, type Params } from "./Context.ts"
import { RefSchema, type Schema } from "./Schema.ts"
import type { ExcludeRefiners, Refinements, Type, Unapplied, UnappliedRefiners } from "./Type.ts"
import { Inspectable } from "./util/Inspectable.ts"
import type { PathBuilder, VisitOutput } from "./VisitOutput.ts"

export type TypeDeclaration<T, R extends Refinements, P extends keyof any> = {
  /** The name of the type. */
  name: string
  /** The origin of the type (a `declare`d type or `declare`d-type-returning function). */
  source: TypeSource
  /** Validate the set of specified refinements and return description factories. */
  refinements?: (refinements: { [K in keyof R]+?: R[K] }) => void | { [K in keyof R]+?: string }
  /** How to create the JSON schema for the current type. */
  subschema: (visit: (type: Type) => Schema, ctx: Context<T, R, P>) => Schema
  /** Specify post-processing on the structured output. */
  output?: (
    f: <O>(value: ProcessOutput<O, T, R>) => ProcessOutput<O, T, R>,
  ) => ProcessOutput<any, T, R>
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

export interface ProcessOutput<O, T, R extends Refinements> {
  /** Predicates corresponding to available refinements. */
  refinementPredicates?: {
    [K in keyof R]+?: (value: O, constraint: R[K] extends Unapplied<infer U> ? U : never) => boolean
  }
  /** Transform the structured output `O` into the target `T` value. */
  visitor?: (value: O, visit: VisitOutput, path: PathBuilder) => T
}

export function declare<T, R extends Refinements, P extends keyof any>(
  decl: TypeDeclaration<T, R, P>,
  ctx = new Context(decl, [], {}),
): Type<T, R, P> {
  return Object.assign(
    <P2 extends Params>(
      template: TemplateStringsArray,
      ...params: P2
    ) => declare<T, R, P | P2[number]>(decl as never, ctx.add(template, params) as never),
    {
      ...Inspectable((inspect) => {
        const { source } = decl
        if (source.getType) {
          return decl.name
        }
        return `${decl.name}(${inspect(source.args)})`
      }) as Inspectable & { T: T; P: P },
      decl,
      ctx,
      refine: <const V extends UnappliedRefiners<R>>(refinements: V) => {
        const nextCtx = ctx.refine(refinements)
        if (decl?.refinements) {
          decl.refinements(nextCtx.refinements as never)
        }
        return declare<T, ExcludeRefiners<R, V>, P>(decl as never, nextCtx)
      },
      schema(this: Type<T, R, never>, refine?: boolean): Schema {
        return RefSchema({}, refine)(this)
      },
      fill<A extends Partial<Args<P>>>(args: A) {
        return declare<T, R, ExcludeArgs<P, A>>(decl, ctx.apply(args))
      },
    },
  )
}
