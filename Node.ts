import type { Falsy } from "@std/assert"
import { isTemplateStringsArray } from "./util/mod.ts"

export interface Node<K extends string = string, T = any> {
  (template: TemplateStringsArray, ...substitutions: Array<string>): this
  (...annotations: Array<AnnotationValue>): this

  T: T

  type: K
  trace: string
  annotations: Array<Annotation>

  clone(): this

  [Symbol.iterator](): Iterator<Task<this>, T, void>
}

export interface Task<N extends Node = Node> {
  type: "Task"
  node: N
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

export function Node<N extends Node>(
  type: N["type"],
  members: Omit<N, keyof Node>,
  trace = new Error().stack!,
  annotations: Array<Annotation> = [],
): N {
  return Object.assign(
    describe,
    members,
    {
      ...{} as { T: N["T"] },
      type,
      trace,
      annotations,
      clone() {
        return Node(type, members, trace, annotations)
      },
      *[Symbol.iterator](): Generator<Task<N>, unknown, void> {
        return yield {
          type: "Task",
          node: this as never,
        }
      },
    } satisfies Pick<N, keyof Node>,
  ) as never

  function describe(template: TemplateStringsArray, ...substitutions: Array<string>): N
  function describe(...annotations: Array<AnnotationValue>): N
  function describe(
    e0: TemplateStringsArray | AnnotationValue,
    ...rest: Array<AnnotationValue>
  ): N {
    return Node(type, members, trace, [
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
