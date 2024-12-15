import type { Falsy } from "@std/assert"
import type { PromiseOr } from "../util/mod.ts"
import type { AnyType } from "./Type.ts"

export type Annotation<T = any> =
  | Falsy
  | string
  | DescriptionTemplate
  | AnyType
  | DescriptionParam
  | DescriptionArg
  | Assertion<T>
  | Metadata

export interface DescriptionTemplate {
  type: "DescriptionTemplate"
  template: TemplateStringsArray
  parts: Array<DescriptionTemplatePart>
}

// TODO: Disallow `Falsy`?
export type DescriptionTemplatePart = string | AnyType | DescriptionParam

export interface DescriptionParam<K extends symbol = symbol, T = any> {
  (arg: T): DescriptionArg<K, T>
  type: "DescriptionParam"
  key: K
}

export interface DescriptionArg<K extends symbol = symbol, T = any> {
  type: "DescriptionArg"
  key: K
  value: T
  serializer?: (value: T) => string
}

export interface Assertion<T = any, A extends unknown[] = any> {
  type: "Assertion"
  description: string | ((...args: A) => string)
  f?: (value: T, ...args: A) => PromiseOr<void>
  args: A
}

export interface MetadataHandle<T> {
  (value: T): Metadata<T>
  key: symbol
}

export interface Metadata<T = any> {
  type: "Metadata"
  key: symbol
  value: T
}

export type ReduceP<D extends symbol, A extends Array<Annotation>> = A extends
  [infer Part0, ...infer PartRest extends Array<Annotation>] ? ReduceP<
    Part0 extends DescriptionParam<infer K> ? D | K
      : Part0 extends DescriptionArg<infer K> ? Exclude<D, K>
      : D,
    PartRest
  >
  : D
