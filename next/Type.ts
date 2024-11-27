import type { EnsureLiteralKeys, Expand } from "../util/type_util.ts"
import { type Args, Context, type ExcludeArgs, type Params } from "./Context.ts"
import type { Schema } from "./Schema.ts"
import type { TypeMetadata } from "./TypeMetadata.ts"

/** The core unit of structure output schema composition. */
export interface Type<
  M extends TypeMetadata = any,
  T = any,
  C extends M["refinements"] = any,
  P extends keyof any = any,
> {
  <P2 extends Params>(
    template: TemplateStringsArray,
    ...params: EnsureLiteralKeys<P2>
  ): Type<M, T, C, P | P2[number]>

  /** The type into which the structured output is transformed. */
  T: T
  /** The literal types of the parameter keys. */
  P: P

  /** Metadata about the current type. */
  metadata: M

  /** The type declaration. */
  declaration: TypeDeclaration<M, T>

  /** Container to be filled with context parts as chaining occurs. */
  ctx: Context<P>

  /** Get the corresponding JSON Schema. */
  schema(this: Type<M, T, C, never>): Schema

  refine: <const V extends Omit<M["refinements"], keyof C>>(
    refinements: V,
  ) => Type<
    M,
    T,
    Expand<C & { -readonly [K in keyof V as V[K] extends undefined ? never : K]: V[K] }>,
    P
  >

  /** Apply context to parameters. */
  fill: <A extends Partial<Args<P>>>(args: A) => Type<M, T, C, ExcludeArgs<P, A>>
}

export namespace Type {
  export function declare<
    M extends TypeMetadata,
    T,
    C extends M["refinements"] = {},
    P extends keyof any = never,
  >(
    metadata: M,
    declaration: TypeDeclaration<M, T>,
    ctx = new Context<P>(),
  ): Type<M, T, C, P> {
    return Object.assign(
      <P2 extends Params>(template: TemplateStringsArray, ...params: P2) =>
        declare<M, T, C, P | P2[number]>(metadata, declaration, ctx.add(template, params)),
      {
        ...{} as { T: T; P: P },
        metadata,
        declaration,
        ctx,
        refine: () => {
          throw 0
        },
        schema: () => {
          throw 0
        },
        assert: declaration.assert,
        transform: declaration.transform,
        fill: <A extends Partial<Args<P>>>(args: A) =>
          declare<M, T, C, ExcludeArgs<P, A>>(metadata, declaration, ctx.apply(args)),
      },
    )
  }
}

export type TypeDeclaration<M extends TypeMetadata, T> = {
  /** How to create the JSON schema for the current type. */
  subschema: (subschema: (type: Type) => Schema) => Schema
  /** Validate the raw structured output is of the expected type. */
  assert: (value: unknown) => asserts value is M["output"]
  /** Transform the structured output into the target `T` value. */
  transform: (value: M["output"]) => T
  /** Validate the set of specified refinements. */
  validateRefinements: (refinements: M["refinements"]) => void
  /** Validations corresponding to available refinements. */
  refinements: {
    [K in keyof M["refinements"]]: (
      value: M["output"],
      constraint: Exclude<M["refinements"][K], undefined>,
    ) => void
  }
}
