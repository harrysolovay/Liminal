import type { Falsy } from "@std/assert"
import { isTemplateStringsArray } from "./util/mod.ts"

export interface Node<K extends string = string, T = any> {
  (template: TemplateStringsArray, ...substitutions: Array<string>): this
  (...annotations: Array<AnnotationValue>): this

  T: T

  type: K
  trace: string
  annotations: Array<Annotation>

  clone(overwrite?: Partial<Omit<this, keyof Node>>): this

  [Symbol.iterator](): Iterator<NodeAction<this>, T, void>
}

export interface NodeAction<N extends Node = Node> {
  type: "Node"
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
  trace: string = new Error().stack!,
  annotations: Array<Annotation> = [],
): N {
  return Object.assign(
    describe,
    members,
    {
      type,
      trace,
      annotations,
      clone(overwrite: Partial<Omit<N, keyof Node>> = {}) {
        return Node(type, { ...members, ...overwrite }, trace, annotations)
      },
      *[Symbol.iterator](): Generator<NodeAction<N>, unknown, void> {
        return yield {
          type: "Node",
          node: this as never,
        }
      },
    } satisfies Pick<N, Exclude<keyof Node, "T">>,
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
