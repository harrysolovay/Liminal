import type { Falsy } from "@std/assert"
import type { Action, Complete } from "./Action.ts"

export function Type<T, E>(
  declaration: TypeDeclaration,
  annotations: Array<Annotation<T> | Template> = [],
  handlers: Array<(event: unknown) => unknown> = [],
): Type<T, E> {
  return Object.assign(
    annotate,
    declaration,
    {
      traces: [new Error().stack!],
      annotations,
      handlers,
      *[Symbol.iterator]() {
        return yield {
          type: "Complete",
          value: this as never,
        }
      },
    } satisfies Omit<Type<T, E>, keyof TypeDeclaration | "T" | "E">,
  ) as never as Type<T, E>

  function annotate(...annotations: Array<Annotation<T>>): Type<T, E>
  function annotate(
    template: TemplateStringsArray,
    ...descriptionParts: Array<TemplatePart>
  ): Type<T, E>
  function annotate(
    _e0?: Annotation<T> | TemplateStringsArray,
    ..._eRest: Array<Annotation<T> | TemplatePart>
  ): Type<T, E> {
    throw 0
  }
}

export interface Type<T, E = never> extends TypeDeclaration, Iterable<Complete, T> {
  (template: TemplateStringsArray, ...descriptionParts: Array<TemplatePart>): this

  (...annotations: Array<Annotation<T>>): this

  <Y extends Action>(
    f: (event: E) => Iterable<Y, void> | AsyncIterable<Y, void>,
  ): Type<T, ExtractEvent<Y>>

  <R>(f: (event: E) => R): Type<T, Exclude<Awaited<R>, void>>

  T: T
  E: E

  traces: Array<string>
  annotations: Array<Annotation<T> | Template>
  handlers: Array<(event: unknown) => unknown>
}

export interface TypeDeclaration {
  type: string
  self(): AnyType | ((...args: any) => AnyType)
  args?: Array<unknown>
}

export type AnyType<T = any, E = any> = Type<T, E>

export type TemplatePart = number | string | AnyType

export type Annotation<T> = Falsy | number | string | Assertion<T>

export type ExtractEvent<Y> = [Extract<Y, AnyType>["E"] | Extract<Y, Event>["data"]][0]

export interface Template {
  type: "Template"
  template: TemplateStringsArray
  parts: Array<TemplatePart>
}

export interface Assertion<T> {
  type: "Assertion"
  description: string
  f?: AssertLike<T>
}

export type AssertLike<T> = (value: T) => void | boolean

export type Derived<T, X extends Array<AnyType>, E = never> = [Type<T, E | X[number]["E"]>][0]
