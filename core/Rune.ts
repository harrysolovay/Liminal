import type { Falsy } from "@std/assert"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { recombine } from "../util/recombine.ts"
import type { Action } from "./Action/Action.ts"
import type { Declaration } from "./Declaration.ts"
import { State } from "./State.ts"

export interface Rune<T = any, E = any> {
  (template: TemplateStringsArray, ...substitutions: Array<string>): this
  (...annotations: Array<AnnotationValue>): this

  T: T
  E: E

  action: "Rune"
  trace: string

  declaration: Declaration
  annotations: Array<Annotation>
  prelude: Array<Action>

  prepend(...action: Array<Action>): Rune<T, E>
  description(): undefined | string
  run(): Promise<T>

  [Symbol.iterator](): Iterator<this, T, void>
}

export type AnnotationValue = Falsy | string | Metadata
export type Annotation = AnnotationValue | {
  template: TemplateStringsArray
  substitutions: Array<string>
}

export interface Metadata {
  type: "Metadata"
  value: unknown
}

export function Rune<T, E>(
  declaration: Declaration,
  annotations: Array<Annotation>,
  prelude: Array<Action>,
): Rune<T, E> {
  return Object.assign(
    annotate,
    declaration,
    {
      action: "Rune",
      declaration,
      trace: new Error().stack!,
      annotations,
      prelude,
      prepend(...actions): Rune<T, E> {
        return Rune(declaration, annotations, [...actions, ...prelude])
      },
      description() {
        const segments: Array<string> = []
        for (const segment of this.annotations) {
          if (segment) {
            if (typeof segment === "string") {
              segments.push(segment)
            } else if ("template" in segment) {
              segments.push(recombine(segment.template, segment.substitutions))
            }
          }
        }
        return segments.length ? segments.join(" ") : undefined
      },
      run() {
        return declaration.consume(new State(this as never)) as never
      },
      *[Symbol.iterator](): Generator<Rune<T, E>, T> {
        return yield this as never
      },
    } satisfies Omit<Rune<T, E>, "T" | "E">,
  ) as never

  function annotate(template: TemplateStringsArray, ...substitutions: Array<string>): Rune<T, E>
  function annotate(...annotations: Array<AnnotationValue>): Rune<T, E>
  function annotate(
    e0: TemplateStringsArray | AnnotationValue,
    ...rest: Array<AnnotationValue>
  ): Rune<T, E> {
    return Rune<T, E>(
      declaration,
      [
        ...annotations,
        ...isTemplateStringsArray(e0)
          ? [{
            template: e0,
            substitutions: rest as Array<string>,
          }]
          : [e0 as AnnotationValue, ...rest],
      ],
      prelude,
    )
  }
}
