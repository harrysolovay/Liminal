import type { PartialType } from "../Type.ts"
import type { Description } from "./Description.ts"
import type { Param } from "./Param.ts"

export interface Template {
  type: "Template"
  template: TemplateStringsArray
  parts: Array<TemplatePart>
}

export type TemplatePart = string | PartialType | Param<Description>
