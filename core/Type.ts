import type { EnsureLiteralKeys } from "../util/mod.ts"
import { type Args, type Assertion, Context, type Params } from "./Context.ts"
// import { inspectBearer } from "./inspectBearer.ts"

/** The core unit of schema composition. */
export interface Type<T, P extends keyof any = never> {
  <P2 extends Params>(
    template: TemplateStringsArray,
    ...params: EnsureLiteralKeys<P2>
  ): Type<T, P | P2[number]>

  /** The native type. */
  T: T
  /** The union of literal types of parameter keys. */
  P: P

  [typeKey]: {
    /** Readonly values that describe the type. */
    declaration: TypeDeclaration
    /** Container to be filled with context parts as chaining occurs. */
    ctx: Context
  }

  /** Fill in parameterized context. */
  fill: <A extends Partial<Args<P>>>(
    args: A,
  ) => Type<T, Exclude<P, keyof { [K in keyof A as A[K] extends undefined ? never : K]: never }>>

  /** Specify assertions to be run on the type's output. */
  assert: <A extends unknown[]>(f: Assertion<T, A>, ...args: A) => Type<T, P>

  /** Annotate the type with arbitrary metadata. */
  annotate: (metadata: Record<keyof any, unknown>) => Type<T, P>

  /** Widen the type for dynamic use cases. */
  widen: () => Type<any, never>
}

export function Type<T, P extends keyof any = never>(
  decl: TypeDeclaration,
  ctx?: Context,
): Type<T, P> {
  ctx = ctx ?? new Context([], [], {})
  const self = Object.assign(
    (template: TemplateStringsArray, ...params: Params) =>
      Type(
        decl,
        new Context(
          [{ template, params }, ...ctx.parts],
          ctx.assertions,
          ctx.metadata,
        ),
      ),
    {
      [typeKey]: { decl, ctx },
      fill: (args: Args) =>
        Type(
          decl,
          new Context(
            [{ args }, ...ctx.parts],
            ctx.assertions,
            ctx.metadata,
          ),
        ),
      assert: (assertion: Assertion, ...args: unknown[]) => {
        const trace = new Error().stack ?? ""
        return Type(
          decl,
          new Context(
            ctx.parts,
            [...ctx.assertions, { assertion, args, trace }],
            ctx.metadata,
          ),
        )
      },
      annotate: (metadata: Record<keyof any, unknown>) =>
        Type(
          decl,
          new Context(ctx.parts, ctx.assertions, {
            ...ctx.metadata,
            ...metadata,
          }),
        ),
      widen: () => self,
      // ...inspectBearer,
    },
  )
  return self as never
}

export const typeKey: unique symbol = Symbol()

export type TypeDeclaration = {
  getAtom: () => AnyType
  factory?: never
  args?: never
} | {
  getAtom?: never
  factory: (...args: any) => AnyType
  args: unknown[]
}

export type AnyType = Type<any, any>

export function isType(value: unknown): value is AnyType {
  return typeof value === "object" && value !== null && typeKey in value
}
