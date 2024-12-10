import type { Falsy } from "@std/assert"
import type { AnyType } from "./Type.ts"

export type Annotation<T = any> =
  | Falsy
  | string
  | DescriptionTemplate
  | AnyType
  | DescriptionParam
  | DescriptionArg
  | Assert<T>
  | Metadata

export interface DescriptionTemplate {
  type: "DescriptionTemplate"
  template: TemplateStringsArray
  parts: Array<DescriptionTemplatePart>
}

// TODO: Disallow `Falsy`?
export type DescriptionTemplatePart = Falsy | string | AnyType | DescriptionParam

export interface DescriptionParam<K extends symbol = symbol, T = any> {
  (arg: T): DescriptionArg<K>
  type: "DescriptionParam"
  key: K
}

export interface DescriptionArg<K extends symbol = symbol> {
  type: "DescriptionArg"
  key: K
  serializer?: (value: unknown) => string
}

export interface Assert<T = any, A extends unknown[] = any> {
  type: "Assert"
  message: string | ((...args: A) => string)
  f?: (value: T, ...args: A) => void | Promise<void>
  args: A
}

export interface Metadata {
  type: "Metadata"
  key: symbol
  value: unknown
}
