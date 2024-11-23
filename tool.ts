import { Ref } from "./Ref.ts"
import type { Schema, Ty } from "./Ty.ts"
import { recombineTaggedTemplateArgs } from "./util/recombineTaggedTemplateArgs.ts"

export function tool<T>(name: string, ty: Ty<T, never>): Tool<T> {
  return tool_(name, ty)
}

function tool_<T>(name: string, ty: Ty<T, never>, description?: string): Tool<T> {
  return Object.assign(
    (template: TemplateStringsArray, ...quasis: string[]) =>
      tool_(
        name,
        ty,
        description ? `${description} ${recombineTaggedTemplateArgs(template, quasis)}` : undefined,
      ),
    {
      type: "function" as const,
      name,
      description,
      parameters: Ref({})(ty),
      toJson() {
        const { type, name, description, parameters } = this
        return { type, name, description, parameters }
      },
    },
  )
}

export interface Tool<T = any> {
  (template: TemplateStringsArray, ...quasis: string[]): Tool<T>
  type: "function"
  /** The name with which OpenAI recognizes the tool. */
  name: string
  /** A description to inform the LLM of when/how to use the tool. */
  description?: string
  /** The tool implementation's argument type in JSON Schema. */
  parameters?: Schema
}
