import type { Falsy } from "@std/assert"
import type { PartialType } from "../Type.ts"
import type { Assertion } from "./Assertion.ts"
import type { Arg, Param } from "./Param.ts"
import type { Template } from "./Template.ts"

export type Annotation<T = any> =
  | Falsy
  | string
  | Template
  | PartialType
  | Assertion<T>
  | Param
  | Arg
