import type { Falsy } from "@std/assert"
import type { JsonValue } from "@std/json"
import type { Action } from "./Action.ts"
import type { ExtractEvent } from "./Event.ts"
import type { Model } from "./Model.ts"

export interface Type<T, E = never> extends TypeDeclaration, Iterable<Complete, T> {
  (template: TemplateStringsArray, ...substitutions: Array<TemplatePart>): this
  (...descriptionParts: Array<DescriptionPart>): this

  T: T
  E: E

  "": {
    traces: Array<string>
    descriptionParts: Array<DescriptionPart | Template>
    handlers: Array<(event: unknown) => unknown>
  }

  handle<Y extends Action>(
    f: (event: E) => Iterable<Y, void> | AsyncIterable<Y, void>,
  ): Type<T, ExtractEvent<Y>>
  handle<R>(f: (event: E) => R): Type<T, Exclude<Awaited<R>, void>>

  run(rootModel: Model): Promise<T>

  description(): undefined | string
  signature(): string
}

export interface TypeDeclaration {
  type: string
  self(): AnyType | ((...args: any) => AnyType)
  args?: Array<unknown>
}

export interface Complete {
  type: "Complete"
  value: AnyType
}

export type AnyType<T = any, E = any> = Type<T, E>

export type TemplatePart = JsonValue | AnyType

export type DescriptionPart = Falsy | JsonValue

export interface Template {
  type: "Template"
  template: TemplateStringsArray
  substitutions: Array<TemplatePart>
}

export type Derived<T, X extends Array<AnyType>, E = never> = [Type<T, E | X[number]["E"]>][0]
