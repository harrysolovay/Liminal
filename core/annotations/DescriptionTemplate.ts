import type { PartialType } from "../Type.ts"
import type { DescriptionParam } from "./DescriptionParam.ts"

export interface DescriptionTemplate {
  type: "DescriptionTemplate"
  template: TemplateStringsArray
  parts: Array<DescriptionTemplatePart>
}

export type DescriptionTemplatePart = string | PartialType | DescriptionParam