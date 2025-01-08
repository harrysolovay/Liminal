import type { Falsy } from "@std/assert"
import type { Action, ExtractEvent } from "./Action/mod.ts"
import { run } from "./run.ts"
import { isTemplateStringsArray } from "./util/mod.ts"

export interface Rune<K extends string = string, T = any, E = any> {
  (template: TemplateStringsArray, ...substitutions: Array<string>): this
  (...annotations: Array<AnnotationValue>): this

  T: T
  E: E

  type: K
  trace: string
  annotations: Array<Annotation>
  prelude: Array<Action>

  prepend<Y extends Array<Action>>(...actions: Y): Rune<K, T, E | ExtractEvent<Y[number]>>
  clone(overwrite?: Partial<Omit<this, keyof Rune>>): this
  run(): Promise<T>

  [Symbol.iterator](): Iterator<RuneAction<this>, T, void>
}

export interface RuneAction<N extends Rune = Rune> {
  type: "Rune"
  rune: N
}

export type AnnotationValue = Falsy | string | Metadata
export interface Metadata {
  type: "Metadata"
  value: unknown
}
export type Annotation = AnnotationValue | {
  template: TemplateStringsArray
  substitutions: Array<string>
}

export function Rune<N extends Rune>(
  type: N["type"],
  members: Omit<N, keyof Rune>,
  trace: string = new Error().stack!,
  annotations: Array<Annotation> = [],
  prelude: Array<Action> = [],
): N {
  return Object.assign(
    describe,
    members,
    {
      type,
      trace,
      annotations,
      prelude,
      prepend: (...actions: Array<Action>) => {
        return Rune(type, members, trace, annotations, [...prelude, ...actions])
      },
      clone(overwrite: Partial<Omit<N, keyof Rune>> = {}) {
        return Rune(type, { ...members, ...overwrite }, trace, annotations)
      },
      run,
      *[Symbol.iterator](): Generator<RuneAction<N>, unknown, void> {
        return yield {
          type: "Rune",
          rune: this as never,
        }
      },
    } satisfies Pick<N, Exclude<keyof Rune, "T" | "E">>,
  ) as never

  function describe(template: TemplateStringsArray, ...substitutions: Array<string>): N
  function describe(...annotations: Array<AnnotationValue>): N
  function describe(
    e0: TemplateStringsArray | AnnotationValue,
    ...rest: Array<AnnotationValue>
  ): N {
    return Rune(type, members, trace, [
      ...annotations,
      ...isTemplateStringsArray(e0)
        ? [{
          template: e0,
          substitutions: rest as Array<string>,
        }]
        : rest,
    ])
  }
}
