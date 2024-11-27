import type { EnsureLiteralKeys, Expand } from "../util/type_util.ts"
import { type Args, Context, type ExcludeArgs, type Params } from "./Context.ts"
import type { Schema } from "./Schema.ts"

/** The core unit of structure output schema composition. */
export interface Type<T = any, R extends Refinements = any, P extends keyof any = any> {
  <P2 extends Params>(
    template: TemplateStringsArray,
    ...params: EnsureLiteralKeys<P2>
  ): Type<T, R, P | P2[number]>

  /** The type into which the structured output is transformed. */
  T: T
  /** The literal types of the parameter keys. */
  P: P

  /** The type declaration. */
  declaration: TypeDeclaration<T, R, any>

  /** Container to be filled with context parts as chaining occurs. */
  ctx: Context<T, R, P>

  refine<
    const V extends {
      [K in keyof R as R[K] extends Refiner<infer _> ? K : never]+?: R[K] extends Refiner<infer S>
        ? S
        : never
    },
  >(refinements: V): Type<
    T,
    Expand<
      & { [K in keyof R as K extends keyof V ? never : K]: R[K] }
      & { -readonly [K in keyof V as V[K] extends undefined ? never : K]: V[K] }
    >,
    P
  >

  /** Get the corresponding JSON Schema. */
  schema(this: Type<T, R, never>): Schema

  /** Apply context to parameters. */
  fill: <A extends Partial<Args<P>>>(args: A) => Type<T, R, ExcludeArgs<P, A>>
}

export type Refinements = Record<string, unknown>

export declare const Refiner: unique symbol
export type Refiner<T = any> = T & { [_ in typeof Refiner]: true }

export namespace Type {
  export function declare<T, R extends Refinements = {}, P extends keyof any = never, O = T>(
    declaration: TypeDeclaration<T, R, O>,
  ): Type<T, { [K in keyof R]: Refiner<R[K]> }, P> {
    return declare_<T, { [K in keyof R]: Refiner<R[K]> }, P, O>(
      declaration,
      new Context([], {}) as never,
    )
  }

  function declare_<T, R extends Refinements, P extends keyof any, O>(
    declaration: TypeDeclaration<T, R, O>,
    ctx: Context<T, R, P>,
  ): Type<T, R, P> {
    return Object.assign(
      <P2 extends Params>(template: TemplateStringsArray, ...params: P2) =>
        declare_<T, R, P | P2[number], O>(declaration, ctx.add(template, params)),
      {
        ...{} as { T: T; P: P },
        declaration,
        ctx,
        refine: () => {
          throw 0
        },
        schema: () => {
          throw 0
        },
        fill: <A extends Partial<Args<P>>>(args: A) =>
          declare_<T, R, ExcludeArgs<P, A>, O>(declaration, ctx.apply(args)),
      },
    )
  }
}

export type TypeDeclaration<T, R extends Refinements, O> = {
  /** Validate the set of specified refinements. */
  assertRefinementsValid?: (refinements: R) => void
  /** How to create the JSON schema for the current type. */
  subschema: (subschema: (type: Type) => Schema) => Schema
  /** Validate the raw structured output is of the expected type. */
  assert: (value: unknown, path: string[]) => asserts value is O
  /** Transform the structured output into the target `T` value. */
  transform?: (value: O) => T
  /** Validations corresponding to available refinements. */
  assertRefinements: {
    [K in keyof R]: (value: O, constraint: Exclude<R[K], undefined>) => void
  }
}

export type TypeSource = {
  atom: () => Type
  factory?: never
  args?: never
} | {
  atom?: never
  factory: (...args: any) => Type
  args: unknown[]
}
