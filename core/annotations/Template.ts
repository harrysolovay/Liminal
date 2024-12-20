import type { PartialType } from "../Type.ts"
import type { DescriptionParamValue } from "./DescriptionParam.ts"
import type { AnyParam } from "./Param.ts"

export interface Template {
  type: "Template"
  template: TemplateStringsArray
  parts: Array<TemplatePart>
}

export type TemplatePart =
  | number
  | string
  | PartialType
  | AnyParam<number | string | DescriptionParamValue>
