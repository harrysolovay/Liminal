import type { Args, Context, ExcludeArgs, Params } from "./Context.ts"
import type { Schema } from "./Schema.ts"
import type { TypeDeclaration } from "./TypeDeclaration.ts"
import type { Inspectable } from "./util/Inspectable.ts"
import type { EnsureLiteralKeys, Expand } from "./util/type_util.ts"

/** The core unit of structure output schema composition. */
export interface Type<
  T = any,
  R extends Refinements = any,
  P extends keyof any = keyof any,
> extends Inspectable {
  <P2 extends Params>(
    template: TemplateStringsArray,
    ...params: EnsureLiteralKeys<P2>
  ): Type<T, R, P | P2[number]>

  /** The type into which the structured output is transformed. */
  T: T
  /** The literal types of the parameter keys. */
  P: P

  /** The type declaration. */
  declaration: TypeDeclaration<T, R, P, any>

  /** Container to be filled with context parts as chaining occurs. */
  ctx: Context<T, R, P>

  /** Apply a refinement to the type. */
  refine<const V extends UnappliedRefiners<R>>(refinements: V): Type<T, ExcludeRefiners<R, V>, P>

  /** Get the corresponding JSON Schema. */
  schema(this: Type<T, R, never>): Schema

  /** Apply context to parameters. */
  fill: <A extends Partial<Args<P>>>(args: A) => Type<T, R, ExcludeArgs<P, A>>
}

export namespace Type {
  export type Initial<T, R extends Refinements = {}> = Type<
    T,
    { [K in keyof R]: Unapplied<R[K]> },
    never
  >
}

export type Refinements = Record<string, unknown>

export declare const Unapplied: unique symbol
export type Unapplied<T = any> = Record<typeof Unapplied, T>

export type UnappliedRefiners<R extends Refinements> = {
  [K in keyof R as R[K] extends Unapplied<infer _> ? K : never]+?: R[K] extends Unapplied<infer S>
    ? S
    : never
}
export type ExcludeRefiners<R extends Refinements, V extends UnappliedRefiners<R>> = Expand<
  & { [K in keyof R as K extends keyof V ? never : K]: R[K] }
  & { -readonly [K in keyof V as V[K] extends undefined ? never : K]: V[K] }
>
