import type { Event } from "./actions.ts"
import type { Annotation, Param, TemplatePart } from "./annotations/mod.ts"
import type { JSONType } from "./JSONSchema.ts"
import type { ReduceDependencies } from "./ReduceDependencies.ts"

export interface Type<T, E = never, D extends symbol = never>
  extends TypeDeclaration, Generator<Event<E>, T>
{
  <A extends Array<Annotation<T>>>(
    ...annotations: A | Array<Annotation<T>> & { length: never }
  ): Type<T, E, ReduceDependencies<D, A>>

  <A extends Array<TemplatePart>>(
    template: TemplateStringsArray,
    ...descriptionParts: A
  ): Type<T, E, ReduceDependencies<D, A>>

  [TypeKey]: true

  T: T
  E: E
  D: D

  node: "Type"
  trace: string
  annotations: Array<Annotation>

  extract<K extends symbol, V>(param: Param<K, V>): Array<V>
  description(): string | undefined

  display(depth?: number): string
  signature(): string
  schema(): JSONType

  deserialize(jsonText: string): T
  assert(value: unknown): asserts value is T
  is(value: unknown): value is T
  serialize(value: T, comments?: boolean): string

  handle<Y>(f: (event: E) => Y): Type<T, Exclude<Y, void>, D>
}

export const TypeKey: unique symbol = Symbol()

export function isType(value: unknown): value is AnyType {
  return typeof value === "object" && value !== null && TypeKey in value
}

export interface TypeDeclaration {
  type: string
  self: () => AnyType | ((...args: any) => AnyType)
  args?: Array<unknown>
}

export type AnyType<T = any, E = any> = Type<T, E, symbol>

export type DerivedType<
  T,
  E,
  X extends Array<AnyType>,
  P extends symbol = never,
> = [Type<T, E, P | X[number]["D"]>][0]

export function assertValueType<T>(value: unknown, type: Type<T>): asserts value is T {
  type.assert(value)
}
