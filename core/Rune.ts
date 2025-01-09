import type { Falsy } from "@std/assert"
import { isTemplateStringsArray } from "../util/isTemplateStringsArray.ts"
import { recombine } from "../util/recombine.ts"
import type { Action } from "./Action/Action.ts"
import { Context } from "./Context.ts"

export interface Rune<T = any, E = any> extends Declaration {
  (template: TemplateStringsArray, ...substitutions: Array<string>): this
  (...annotations: Array<AnnotationValue>): this

  T: T
  E: E

  action: "Rune"
  trace: string

  annotations: Array<Annotation>
  prelude: Array<Action>

  prepend(...action: Array<Action>): Rune<T, E>
  description(): undefined | string
  run(): Promise<T>

  [Symbol.iterator](): Iterator<this, T, void>
}

export interface Declaration {
  kind: string
  self: () => Rune | ((...args: any) => Rune)
  args?: Array<unknown>
  phantom?: boolean
  consume(this: Rune, ctx: Context): Promise<unknown>
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
  annotations: Array<Annotation> = [],
  prelude: Array<Action> = [],
): Rune<T, E> {
  return Object.assign(
    annotate,
    declaration,
    {
      action: "Rune",
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
      async run() {
        return (this as Rune).consume(await Context.make(this as never)) as never
      },
      *[Symbol.iterator](): Generator<Rune<T, E>, T> {
        return yield this as never
      },
    } satisfies Omit<Rune<T, E>, keyof Declaration | "T" | "E">,
  ) as never

  function annotate(template: TemplateStringsArray, ...substitutions: Array<string>): Rune<T, E>
  function annotate(...annotations: Array<AnnotationValue>): Rune<T, E>
  function annotate(
    e0: TemplateStringsArray | AnnotationValue,
    ...rest: Array<AnnotationValue>
  ): Rune<T, E> {
    return Rune(
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
