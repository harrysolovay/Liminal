import { type EnsureLiteralKeys, Inspectable } from "../util/mod.ts"
import { type Args, type Assertion, Context, type Params } from "./Context.ts"
import type { ValueVisitorContext } from "./ValueVisitorContext.ts"

/** The core unit of schema composition. */
export interface Type<T, P extends keyof any = never> extends Inspectable {
  <P2 extends Params>(
    template: TemplateStringsArray,
    ...params: EnsureLiteralKeys<P2>
  ): Type<T, P | P2[number]>

  /** The native type. */
  T: T

  /** The union of literal types of parameter keys. */
  P: P

  /** Readonly values that describe the type. */
  [declarationKey]: TypeDeclaration<T>

  /** Container to be filled with context parts as chaining occurs. */
  "": Context

  /** Fill in parameterized context. */
  fill: <A extends Partial<Args<P>>>(args: A) => Type<
    T,
    Exclude<
      P,
      keyof { [K in keyof A as A[K] extends undefined ? never : K]: never }
    >
  >

  /** Specify assertions to be run on the type's output. */
  assert: <A extends unknown[]>(f: Assertion<T, A>, ...args: A) => Type<T, P>

  /** Create a new type representing the result of applying the specified transformation to `T`. */
  transform: <O>(f: (from: T) => O) => Type<O, P>
}

export const declarationKey = Symbol()

export type TypeDeclaration<T> = {
  /** The name of the type. */
  name: string
  /** The origin of the type (a `declare`d type or `declare`d-type-returning function). */
  source: TypeSource
  /** Describes how to visit child values if any. */
  visitValue?: (value: T, ctx: ValueVisitorContext) => void
}

export type TypeSource = {
  getType: () => AnyType
  factory?: never
  args?: never
} | {
  getType?: never
  factory: (...args: any) => AnyType
  args: unknown[]
}

export type AnyType = Type<any, any>

export function declareType<T>(declaration: TypeDeclaration<T>): Type<T, never> {
  return declare_<T, never>(declaration, new Context([], []))
}

function declare_<T, P extends keyof any>(
  declaration: TypeDeclaration<T>,
  context: Context,
): Type<T, P> {
  return Object.assign(
    (template: TemplateStringsArray, ...params: Params) =>
      declare_(
        declaration,
        new Context([{ template, params }, ...context.parts], context.assertions),
      ),
    {
      [declarationKey]: declaration,
      "": context,
      fill: (args: Args) =>
        declare_(
          declaration,
          new Context([{ args }, ...context.parts], context.assertions),
        ),
      assert: (assertion: Assertion, ...args: unknown[]) =>
        declare_(
          declaration,
          new Context(context.parts, [...context.assertions, [assertion, args]]),
        ),
      transform: () => {
        throw 0
      },
      ...Inspectable((inspect) => {
        const { source } = declaration
        if (source.getType) {
          return declaration.name
        }
        return `${declaration.name}(${inspect(source.args)})`
      }),
    },
  ) as never
}

export function isType(value: unknown): value is AnyType {
  return typeof value === "object" && value !== null && declarationKey in value
}
