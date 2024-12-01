import type { EnsureLiteralKeys, Inspectable } from "../util/mod.ts"
import type { Args, Assertion, Context, Params } from "./Context.ts"
import type { VisitValue } from "./ValueVisitorContext.ts"

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
  visitValue?: (value: T, visit: VisitValue) => T
  /** A transform to be applied to the value. */
  transform?: (value: any) => T
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

export function isType(value: unknown): value is AnyType {
  return typeof value === "object" && value !== null && declarationKey in value
}
