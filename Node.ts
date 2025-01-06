import type { Falsy } from "@std/assert"
import { isTemplateStringsArray } from "./util/mod.ts"

export interface Node<
  K extends string = string,
  Self extends Node = any,
  T = any,
> extends Iterable<Task<Self>, T> {
  (template: TemplateStringsArray, ...substitutions: Array<string>): this
  (...values: Array<DescriptionValue>): this

  Self: Self
  T: T

  type: K
  trace: string
  descriptionParts: Array<DescriptionPart>
}

export interface Task<N extends Node = any> {
  type: "Task"
  node: N
}

export type DescriptionValue = Falsy | string
export type DescriptionPart = DescriptionValue | {
  template: TemplateStringsArray
  substitutions: Array<string>
}

export function Node<N extends Node>(
  type: N["type"],
  members: Omit<N, keyof Node>,
  trace = new Error().stack!,
  descriptionParts: Array<DescriptionPart> = [],
): N {
  return Object.assign(describe, members, {
    type,
    trace,
    descriptionParts,
    *[Symbol.iterator](): Generator<Task<N["Self"]>, unknown, void> {
      return yield {
        type: "Task",
        node: this as never,
      }
    },
  }) as never

  function describe(template: TemplateStringsArray, ...substitutions: Array<string>): N
  function describe(...values: Array<DescriptionValue>): N
  function describe(
    e0: TemplateStringsArray | DescriptionValue,
    ...rest: Array<DescriptionValue>
  ): N {
    return Object.assign(
      describe,
      Node(type, members, trace, [
        ...descriptionParts,
        ...isTemplateStringsArray(e0)
          ? [{
            template: e0,
            substitutions: rest as Array<string>,
          }]
          : rest,
      ]),
    )
  }
}
