import type { Falsy } from "@std/assert"
import type { PartialType } from "../Type.ts"
import type { Arg, Assertion, Description, Metadata, Param, Template } from "./mod.ts"

export type Annotation<T = any> =
  | Falsy
  | string
  | Template
  | PartialType
  | Assertion<T>
  | Param<Description | Metadata>
  | Arg<Description | Metadata>
