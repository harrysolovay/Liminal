import type { Falsy } from "@std/assert"
import type { Action } from "./Action.ts"
import type { ExtractEvent } from "./Event.ts"
import type { Model } from "./Model.ts"

export interface Type<T, E> extends TypeDeclaration, Iterable<Complete, T> {
  (
    template: TemplateStringsArray,
    ...substitutions: Array<DescriptionSubstitution>
  ): this
  (...values: Array<DescriptionValue>): this

  T: T
  E: E

  trace: string
  descriptionParts: Array<DescriptionPart>
  eventHandlers: Array<(event: unknown) => unknown>

  handle<Y extends Action>(
    f: (event: E) => Iterable<Y, void> | AsyncIterable<Y, void>,
  ): Type<T, ExtractEvent<Y>>
  handle<R>(f: (event: E) => R): Type<T, Exclude<Awaited<R>, void>>

  run(model: Model): Promise<T>
}

export type AnyType<T = any> = Type<T, any>

export interface TypeDeclaration {
  type: string
  self(): AnyType | ((...args: any) => AnyType)
  args?: Array<unknown>
}

export interface Complete {
  type: "Complete"
  value: AnyType
}

export type DescriptionSubstitution = string | AnyType
export type DescriptionValue = Falsy | string
export type DescriptionPart = DescriptionValue | {
  template: TemplateStringsArray
  substitutions: Array<DescriptionSubstitution>
}
