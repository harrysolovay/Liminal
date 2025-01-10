import type { Falsy } from "@std/assert"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"

export interface Rune<K extends string = string, T = any> extends Declaration<K> {
  (template: TemplateStringsArray, ...substitutions: Array<AnnotationSubstitution>): this
  (...annotations: Array<AnnotationValue>): this

  T: T

  action: "Rune"
  kind: K
  annotations: Array<Annotation>

  [Symbol.iterator](): Iterator<this, T, void>
}

export interface Declaration<K extends string = string> {
  kind: K
  self: () => Rune | ((...args: any) => Rune)
  args?: Array<unknown>
}

export type AnnotationValue = Falsy | string | Metadata
export interface Metadata {
  type: "Metadata"
  value: unknown
}

export type Annotation = AnnotationValue | AnnotationTemplate
export interface AnnotationTemplate {
  template: TemplateStringsArray
  substitutions: Array<AnnotationSubstitution>
}
export type AnnotationSubstitution = string | Rune

export function Rune<X extends Rune>(
  declaration: Declaration<X["kind"]>,
  annotations: Array<Annotation> = [],
): X {
  return Object.assign(
    annotate,
    declaration,
    {
      action: "Rune",
      annotations,
      *[Symbol.iterator]() {
        return yield this as never
      },
    } satisfies Omit<Rune, keyof Declaration | "T">,
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
    return Rune(declaration, [
      ...annotations,
      ...isTemplateStringsArray(e0)
        ? [{
          template: e0,
          substitutions: rest as Array<AnnotationSubstitution>,
        }]
        : [e0, ...rest] as Array<AnnotationValue>,
    ])
  }
}
