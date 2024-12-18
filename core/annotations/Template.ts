import type { PartialType } from "../Type.ts"
import type { DescriptionArg } from "./Description.ts"
import type { AnyParam } from "./Param.ts"

export interface Template {
  type: "Template"
  template: TemplateStringsArray
  parts: Array<TemplatePart>
}

export type TemplatePart = string | PartialType | AnyParam<string | DescriptionArg>
