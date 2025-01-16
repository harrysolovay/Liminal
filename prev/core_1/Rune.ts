import type { Falsy } from "@std/assert"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import type { State } from "./State.ts"

export interface Rune<K extends string = string, T = any> extends RuneBase<T>, Declaration<K, T> {
  (template: TemplateStringsArray, ...substitutions: Array<AnnotationSubstitution>): this
  (...annotations: Array<AnnotationValue>): this
  T: T
}

export interface RuneBase<T> {
  annotations: Array<Annotation>
  [Symbol.iterator](): Iterator<this, T, void>
}

export interface Declaration<K extends string, T> {
  kind: K
  self: () => Rune | ((...args: any) => Rune)
  args?: Array<unknown>
  exec(this: Rune, state?: State): Promise<T>
}

export type AnnotationSubstitution = string | Rune
export type AnnotationValue = Falsy | string | Metadata
export interface Metadata {
  type: "Metadata"
  key: symbol
  value: unknown
}
export type Annotation = AnnotationValue | AnnotationTemplate
export interface AnnotationTemplate {
  template: TemplateStringsArray
  substitutions: Array<AnnotationSubstitution>
}

export function Rune<X extends Rune>(
  declaration: Declaration<X["kind"], X["T"]>,
  members: Omit<X, keyof Rune> & ThisType<X>,
  annotations: Array<Annotation>,
): X {
  return Object.assign(
    annotate,
    declaration,
    members,
    {
      annotations,
      *[Symbol.iterator]() {
        return yield this as never
      },
    } satisfies RuneBase<X["T"]>,
  ) as never

  function annotate(
    template: TemplateStringsArray,
    ...substitutions: Array<AnnotationSubstitution>
  ): X
  function annotate(...annotations: Array<AnnotationValue>): X
  function annotate(
    e0: TemplateStringsArray | AnnotationValue,
    ...rest: Array<AnnotationSubstitution | AnnotationValue>
  ): X {
    return Rune(declaration, members, [
      ...isTemplateStringsArray(e0)
        ? [{
          template: e0,
          substitutions: rest as Array<AnnotationSubstitution>,
        }]
        : [e0, ...rest] as Array<AnnotationValue>,
    ])
  }
}
