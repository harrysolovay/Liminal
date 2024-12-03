import type { EnsureLiteralKeys } from "../util/mod.ts"
import { type Args, type Assertion, Context, type Params } from "./Context.ts"
import { inspectBearer } from "./inspectBearer.ts"

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
    context: Context
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
  declaration: TypeDeclaration,
  context: Context = new Context([], [], {}),
): Type<T, P> {
  const self = Object.assign(
    (template: TemplateStringsArray, ...params: Params) =>
      Type(
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
        Type(
          declaration,
          new Context(
            [{ args }, ...context.parts],
            context.assertions,
            context.metadata,
          ),
        ),
      assert: (assertion: Assertion, ...args: unknown[]) => {
        const trace = new Error().stack ?? ""
        return Type(
          declaration,
          new Context(
            context.parts,
            [...context.assertions, { assertion, args, trace }],
            context.metadata,
          ),
        )
      },
      annotate: (metadata: Record<keyof any, unknown>) =>
        Type(
          declaration,
          new Context(context.parts, context.assertions, {
            ...context.metadata,
            ...metadata,
          }),
        ),
      widen: () => self,
      ...inspectBearer,
    },
  )
  return self as never
}

export const typeKey: unique symbol = Symbol()

export type TypeDeclaration = {
  getType: () => AnyType
  factory?: never
  args?: never
} | {
  getType?: never
  factory: (...args: any) => AnyType
  args: unknown[]
}

export type AnyType = Type<any, any>

export function isType(value: unknown): value is AnyType {
  return typeof value === "object" && value !== null && typeKey in value
}
