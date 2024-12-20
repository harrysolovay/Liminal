import type { Arg, Param } from "../annotations/mod.ts"
import type { PartialType } from "../Type.ts"

export function extract<K extends symbol, V>(this: PartialType, param: Param<K, V>): Array<V> {
  return this.annotations.filter((annotation): annotation is Arg<K> =>
    typeof annotation === "object" && annotation?.type === "Arg"
    && annotation.key === param.key
  ).map((arg) => arg.value)
}
