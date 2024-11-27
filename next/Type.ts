import type { EnsureLiteralKeys } from "../util/type_util.ts"
import {
  type Args,
  type AvailableRefiners,
  Context,
  type ExcludeArgs,
  type ExcludeRefiners,
  type Params,
} from "./Context.ts"
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

  /** Apply a refinement to the type. */
  refine<const V extends AvailableRefiners<R>>(refinements: V): Type<T, ExcludeRefiners<R, V>, P>

  /** Get the corresponding JSON Schema. */
  schema(this: Type<T, R, never>): Schema

  /** Apply context to parameters. */
  fill: <A extends Partial<Args<P>>>(args: A) => Type<T, R, ExcludeArgs<P, A>>
}

export type Refinements = Record<string, unknown>

export declare const Refiner: unique symbol
export type Refiner<T = any> = T & { [_ in typeof Refiner]: true }
export type Refiners<R extends Refinements> = { [K in keyof R]: Refiner<R[K]> }

export namespace Type {
  export function declare<
    T,
    R extends Refinements = {},
    P extends keyof any = never,
    O = T,
  >(
    declaration: TypeDeclaration<T, R, O>,
  ): Type<T, Refiners<R>, P> {
    return declare_<T, Refiners<R>, P, O>(
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
  /** The name of the type. */
  name: string
  /** The origin of the type (a `declare`d type or `declare`d-type-returning function). */
  source: TypeSource
  /** How to create the JSON schema for the current type. */
  subschema: (subschema: (type: Type) => Schema) => Schema
  /** Validate the raw structured output is of the expected type. */
  assert: (value: unknown, assertionCtx: AssertionContext) => asserts value is O
  /** Transform the structured output into the target `T` value. */
  transform: (value: O) => T
  /** Validate the set of specified refinements. */
  assertRefinementsValid?: (refinements: R) => void
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

export class AssertionContext {
  errors: string[] = []

  constructor(readonly path: string[]) {}

  *assertExists<T>(value: T): Generator<{ msg?: string }, Exclude<T, undefined | null>, unknown> {
    if (value === undefined || value === null) {
      yield { msg: "DNE" }
    }
    return value as never
  }

  *assertString<T>(value: T): Generator<{ msg?: string }, string, unknown> {
    if (typeof value !== "string") {
      yield { msg: "NOT_STRING" }
    }
    return value as never
  }
}
