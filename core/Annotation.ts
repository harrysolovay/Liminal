import type { Falsy } from "@std/assert"
import type { DescriptionArg, DescriptionParam } from "./annotations/DescriptionParam.ts"
import type { DescriptionTemplate } from "./annotations/DescriptionTemplate.ts"
import type { Metadata } from "./annotations/Metadata.ts"
import type { Assert } from "./annotations/mod.ts"
import type { PartialType } from "./Type.ts"

export type Annotation<T = any> =
  | Falsy
  | string
  | DescriptionTemplate
  | PartialType
  | DescriptionParam
  | DescriptionArg
  | Assert<T>
  | Metadata

export type ReduceP<D extends symbol, A extends Array<Annotation>> = A extends
  [infer Part0, ...infer PartRest extends Array<Annotation>] ? ReduceP<
    Part0 extends DescriptionParam<infer K> ? D | K
      : Part0 extends DescriptionArg<infer K> ? Exclude<D, K>
      : D,
    PartRest
  >
  : D
