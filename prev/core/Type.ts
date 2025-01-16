import type { Falsy } from "@std/assert"

export * as Type from "./Type/mod.ts"

export interface Type<T = any> extends Iterable<void, T> {
  (template: TemplateStringsArray, ...substitutions: Array<AnnotationSubstitution>): this
  (...values: Array<AnnotationValue>): this

  kind: "Type"

  self(): Type
  args?: Array<unknown>

  annotations: Array<Annotation>

  description(): undefined | string
}

export type AnnotationSubstitution = string | Type
export type AnnotationValue = Falsy | string
export type Annotation = AnnotationValue | AnnotationTemplate
export interface AnnotationTemplate {
  template: TemplateStringsArray
  substitutions: Array<AnnotationSubstitution>
}
